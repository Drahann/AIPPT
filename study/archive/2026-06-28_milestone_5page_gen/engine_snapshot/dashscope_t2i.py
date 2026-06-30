#!/usr/bin/env python3
"""DashScope (阿里云百炼) 通义万相 文生图客户端 —— 创赛 AI 生图系统基础组件.

为何自写而非用 ppt-master/image_gen.py：本系统的 gap 资产生成要绑定
创赛 deck 级 rendering/palette + 透明/黑底合成 + 审计 sidecar，独立一层更干净。

用法：
  单图：  python dashscope_t2i.py --prompt "..." --size 1024*1024 -o out.png
  批量：  python dashscope_t2i.py --manifest <proj>/images/image_prompts.json
          # manifest = [{filename, prompt, size?, negative?, model?}], 结果写回 + sidecar

环境：DASHSCOPE_API_KEY（或 --key）。模型默认 wan2.2-t2i-flash。
异步流程：提交 → task_id → 轮询(10s) → 下载(URL 24h 有效)。
"""
from __future__ import annotations
import argparse, json, os, sys, time, urllib.request, urllib.error

SUBMIT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
TASK   = "https://dashscope.aliyuncs.com/api/v1/tasks/{}"
DEFAULT_MODEL = "wan2.2-t2i-flash"


def _req(url, key, *, method="GET", body=None, headers=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {key}")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {e.code}: {detail}") from None


def submit(key, prompt, size, model=DEFAULT_MODEL, negative="", n=1, prompt_extend=True):
    params = {"size": size, "n": n, "prompt_extend": prompt_extend, "watermark": False}
    if negative:
        params["negative_prompt"] = negative
    resp = _req(SUBMIT, key, method="POST",
                body={"model": model, "input": {"prompt": prompt}, "parameters": params},
                headers={"X-DashScope-Async": "enable"})
    tid = resp.get("output", {}).get("task_id")
    if not tid:
        raise RuntimeError(f"submit failed: {resp}")
    return tid


def poll(key, tid, timeout=300, interval=8):
    t0 = time.time()
    while time.time() - t0 < timeout:
        r = _req(TASK.format(tid), key)
        st = r.get("output", {}).get("task_status")
        if st == "SUCCEEDED":
            return r
        if st in ("FAILED", "UNKNOWN"):
            raise RuntimeError(f"task {st}: {json.dumps(r, ensure_ascii=False)}")
        time.sleep(interval)
    raise TimeoutError(f"task {tid} timed out after {timeout}s")


def gen_one(key, prompt, out_path, size="1024*1024", model=DEFAULT_MODEL, negative="", prompt_extend=True):
    tid = submit(key, prompt, size, model, negative, prompt_extend=prompt_extend)
    print(f"  [{os.path.basename(out_path)}] task_id={tid} polling...", flush=True)
    res = poll(key, tid)
    results = res.get("output", {}).get("results", [])
    url = results[0].get("url")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    urllib.request.urlretrieve(url, out_path)
    rec = {"filename": os.path.basename(out_path), "out": out_path, "task_id": tid,
           "url": url, "prompt": prompt, "size": size, "model": model, "negative": negative,
           "usage": res.get("usage")}
    print(f"  -> saved {out_path}", flush=True)
    return rec


def run_manifest(key, manifest_path):
    items = json.load(open(manifest_path, encoding="utf-8"))
    proj_images = os.path.dirname(os.path.abspath(manifest_path))
    sidecar = []
    for it in items:
        out = os.path.join(proj_images, it["filename"])
        rec = gen_one(key, it["prompt"], out,
                      size=it.get("size", "1024*1024"),
                      model=it.get("model", DEFAULT_MODEL),
                      negative=it.get("negative", ""))
        rec["page"] = it.get("page"); rec["role"] = it.get("role")
        sidecar.append(rec)
    side_path = os.path.join(proj_images, "image_results.json")
    json.dump(sidecar, open(side_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\nmanifest done: {len(sidecar)} images -> sidecar {side_path}")


def main():
    ap = argparse.ArgumentParser(description="DashScope 万相 文生图")
    ap.add_argument("--prompt"); ap.add_argument("-o", "--out")
    ap.add_argument("--manifest")
    ap.add_argument("--size", default="1024*1024")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--negative", default="")
    ap.add_argument("--key", default=os.environ.get("DASHSCOPE_API_KEY", ""))
    a = ap.parse_args()
    if not a.key:
        sys.exit("no API key (set DASHSCOPE_API_KEY or --key)")
    if a.manifest:
        run_manifest(a.key, a.manifest)
    elif a.prompt and a.out:
        gen_one(a.key, a.prompt, a.out, size=a.size, model=a.model, negative=a.negative)
    else:
        sys.exit("need --manifest OR (--prompt and -o)")


if __name__ == "__main__":
    main()
