import win32com.client
import os
import sys

pptx_path = r"w:\3spring\AIPPT\results\龙影元宇宙多模态智能数据手套项目 (2).pptx"
out_dir = r"w:\3spring\AIPPT\temp_slides"
os.makedirs(out_dir, exist_ok=True)

try:
    print(f"Opening PowerPoint to export: {pptx_path}")
    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    # Minimizing the window
    presentation = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
    
    # Export all slides as PNG
    presentation.Export(out_dir, "PNG")
    print(f"Successfully exported slides to {out_dir}")
    
    presentation.Close()
    powerpoint.Quit()
except Exception as e:
    print(f"Failed to export PPTX: {e}")
    sys.exit(1)
