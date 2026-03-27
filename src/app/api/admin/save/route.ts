// src/app/api/admin/save/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src', 'data', 'portfolio-data.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error saving portfolio data:', err);
    return NextResponse.json({ error: (err as any)?.message ?? 'unknown' }, { status: 500 });
  }
}
