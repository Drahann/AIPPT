#!/usr/bin/env python3
"""vlm — multi-key load-balanced Qwen-VL client for offline corpus building.

Spreads load across the 5 百炼 keys (round-robin + auto-rotate on 429/limit). Vision
calls take a local image path; returns text or parsed JSON. Large images are downscaled
before upload to save tokens (page renders 1280x720 are fine; raw assets can be 4400px).

CLI (smoke test):  python vlm.py <image> "<prompt>"
As a module:       from vlm import VLM ; v=VLM(); v.ask_json(img, prompt)
"""
import os, json, base64, io, time, itertools, threading, random
from openai import OpenAI
from PIL import Image

_CFG = json.load(open(os.path.join(os.path.dirname(__file__), 'keys.local.json'), encoding='utf-8'))
# qwen3.7-max (flagship, vision) — the bare alias rejects image input, must use the dated id.
# cheaper bulk fallbacks: qwen3-vl-plus / qwen3-vl-flash.
DEFAULT_MODEL = 'qwen3.7-max-2026-06-08'


def _b64(path, max_side=1280):
    im = Image.open(path).convert('RGB')
    if max(im.size) > max_side:
        r = max_side / max(im.size)
        im = im.resize((int(im.width * r), int(im.height * r)))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=85)
    return base64.b64encode(buf.getvalue()).decode()


class VLM:
    def __init__(self, model=DEFAULT_MODEL, keys=None, base_url=None):
        self.model = model
        self.keys = keys or _CFG['keys']
        self.base = base_url or _CFG['base_url']
        self.clients = [OpenAI(api_key=k, base_url=self.base) for k in self.keys]
        order = list(range(len(self.clients)))
        random.shuffle(order)                       # random start/order per process -> no single key hammered across a batch
        self._rr = itertools.cycle(order)
        self._lock = threading.Lock()
        self.calls = 0

    def _next(self):
        with self._lock:
            return next(self._rr)

    def ask(self, image_path, prompt, max_tokens=1200, retries=4):
        url = f"data:image/jpeg;base64,{_b64(image_path)}"
        msg = [{"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": url}}]}]
        last = None
        for attempt in range(retries):
            i = self._next()
            try:
                r = self.clients[i].chat.completions.create(
                    model=self.model, messages=msg, max_tokens=max_tokens, temperature=0.2)
                with self._lock:
                    self.calls += 1
                return r.choices[0].message.content
            except Exception as e:
                last = e
                s = str(e)
                # rate-limit / throttle -> rotate key + backoff; else short retry
                time.sleep(1.5 * (attempt + 1) if ('429' in s or 'limit' in s.lower() or 'throttl' in s.lower()) else 0.6)
        raise RuntimeError(f"VLM failed after {retries}: {str(last)[:120]}")

    def ask_json(self, image_path, prompt, **kw):
        """prompt MUST ask for JSON; we strip code fences and parse."""
        txt = self.ask(image_path, prompt + "\n\n只输出 JSON，不要解释、不要```。", **kw)
        t = txt.strip()
        if t.startswith('```'):
            t = t.split('```')[1]
            if t.startswith('json'):
                t = t[4:]
        t = t[t.find('{'): t.rfind('}') + 1]
        return json.loads(t)


if __name__ == '__main__':
    import sys
    v = VLM()
    out = v.ask(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "用中文一句话描述这张图。")
    print(out)
