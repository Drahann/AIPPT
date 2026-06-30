#!/usr/bin/env python3
"""save_transcript — SubagentStop hook: auto-archive a finished subagent's transcript.

Registered in .claude/settings.json under hooks.SubagentStop. Claude Code pipes a JSON payload
on stdin that includes `transcript_path` (the subagent's transcript .jsonl). We copy that .jsonl
into study/runs/_transcripts/ AND emit a readable .txt (assistant narration + [tool: ...] markers)
so the user never has to hand-copy. Must NEVER fail the hook -> everything wrapped in try/except.
"""
import sys, os, json, time, shutil

OUT = r'W:\ppt\study\runs\_transcripts'


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return
    tp = payload.get('transcript_path') or ''
    if not tp or not os.path.exists(tp):
        return
    os.makedirs(OUT, exist_ok=True)
    ts = time.strftime('%Y%m%d_%H%M%S')
    base = f'subagent_{ts}'
    try:
        shutil.copy(tp, os.path.join(OUT, base + '.jsonl'))
    except Exception:
        pass
    # readable txt: assistant text/thinking + tool markers, in order
    try:
        lines = []
        for ln in open(tp, encoding='utf-8'):
            try:
                rec = json.loads(ln)
            except Exception:
                continue
            msg = rec.get('message') or {}
            if rec.get('type') != 'assistant' and msg.get('role') != 'assistant':
                continue
            content = msg.get('content')
            if isinstance(content, str):
                lines.append(content)
            elif isinstance(content, list):
                for b in content:
                    if not isinstance(b, dict):
                        continue
                    t = b.get('type')
                    if t in ('text', 'thinking'):
                        txt = b.get('text') or b.get('thinking') or ''
                        if txt.strip():
                            lines.append(txt.strip())
                    elif t == 'tool_use':
                        lines.append(f"[tool: {b.get('name', '?')}]")
        if lines:
            open(os.path.join(OUT, base + '.txt'), 'w', encoding='utf-8').write('\n\n'.join(lines))
    except Exception:
        pass


if __name__ == '__main__':
    main()
