#!/usr/bin/env python3
"""
pptx2png.py — 将 PPTX 文件的每一页导出为 PNG 图片

使用方式:
    python pptx2png.py <input.pptx> [output_dir]

参数:
    input.pptx   - PPTX 文件路径
    output_dir   - 输出目录（默认在 PPTX 同目录创建 <文件名>_slides/ 文件夹）

需要:
    - Windows 系统 + 已安装 Microsoft PowerPoint
    - pip install pywin32

原理:
    通过 COM 自动化调用 PowerPoint 应用程序，
    使用 Slide.Export() 方法将每页幻灯片导出为 PNG，
    保证与 PowerPoint 中看到的完全一致的渲染效果。
"""

import os
import sys
import time
import glob


def pptx_to_png(pptx_path: str, output_dir: str | None = None, width: int = 1920) -> list[str]:
    """
    将 PPTX 文件转换为一系列 PNG 图片。

    Args:
        pptx_path: PPTX 文件的绝对路径
        output_dir: PNG 输出目录（None 则自动创建）
        width: 导出图片宽度（像素），默认 1920

    Returns:
        生成的 PNG 文件路径列表
    """
    import win32com.client
    import pythoncom

    # 初始化 COM
    pythoncom.CoInitialize()

    pptx_path = os.path.abspath(pptx_path)
    if not os.path.isfile(pptx_path):
        raise FileNotFoundError(f"找不到文件: {pptx_path}")

    # 确定输出目录
    if output_dir is None:
        base_name = os.path.splitext(os.path.basename(pptx_path))[0]
        output_dir = os.path.join(os.path.dirname(pptx_path), f"{base_name}_slides")

    os.makedirs(output_dir, exist_ok=True)

    # 启动 PowerPoint
    print(f"[pptx2png] 启动 PowerPoint...")
    ppt_app = win32com.client.Dispatch("PowerPoint.Application")
    # ppt_app.Visible = True  # 调试时可取消注释

    png_files = []

    try:
        # 打开文件（只读模式）
        print(f"[pptx2png] 打开: {pptx_path}")
        presentation = ppt_app.Presentations.Open(
            pptx_path,
            ReadOnly=True,    # 只读
            Untitled=False,
            WithWindow=False  # 不显示窗口
        )

        slide_count = presentation.Slides.Count
        print(f"[pptx2png] 共 {slide_count} 页幻灯片")

        # 计算导出尺寸（保持 16:9 比例）
        height = int(width * 9 / 16)

        for i in range(1, slide_count + 1):
            slide = presentation.Slides(i)
            filename = f"slide-{str(i).zfill(3)}.png"
            filepath = os.path.join(output_dir, filename)

            # Export(Path, FilterName, ScaleWidth, ScaleHeight)
            slide.Export(filepath, "PNG", width, height)

            file_size = os.path.getsize(filepath) / 1024
            print(f"  [{i}/{slide_count}] {filename} ({file_size:.1f} KB)")
            png_files.append(filepath)

        presentation.Close()
        print(f"\n[pptx2png] DONE! {len(png_files)} PNG saved to: {output_dir}")

    except Exception as e:
        print(f"\n[pptx2png] ERROR: {e}")
        raise
    finally:
        # 如果没有其他打开的演示文稿，退出 PowerPoint
        try:
            if ppt_app.Presentations.Count == 0:
                ppt_app.Quit()
        except:
            pass
        pythoncom.CoUninitialize()

    return png_files


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("错误: 请提供 PPTX 文件路径")
        print(f"\n用法: python {os.path.basename(__file__)} <input.pptx> [output_dir]")

        # 自动查找当前目录下的 pptx 文件
        pptx_files = glob.glob("*.pptx")
        if pptx_files:
            print(f"\n当前目录下找到 {len(pptx_files)} 个 PPTX 文件:")
            for f in pptx_files:
                print(f"  - {f}")
        sys.exit(1)

    pptx_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    start = time.time()
    files = pptx_to_png(pptx_path, output_dir)
    elapsed = time.time() - start

    print(f"[pptx2png] 耗时: {elapsed:.1f}s")


if __name__ == "__main__":
    main()
