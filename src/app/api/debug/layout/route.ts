import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(`[API] Received layout snapshot for slide ${data.slideIndex}`);
    
    // Use sessionId if available, otherwise fallback to a generic session-id based on the first capture's timestamp
    const sessionId = data.sessionId || `session-${new Date().toISOString().split('T')[0]}`;
    const debugDir = path.join(process.cwd(), 'debug-data', sessionId);
    
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }

    const timestamp = new Date().getTime();
    const filename = `layout-snap-${timestamp}-${data.slideIndex}.json`;
    const filepath = path.join(debugDir, filename);

    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, path: filepath });
  } catch (error) {
    console.error('Failed to save layout debug data:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
