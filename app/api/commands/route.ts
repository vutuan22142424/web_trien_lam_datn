import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 200) : 200;

    const query: Record<string, any> = {};
    if (status) query.latestStatus = status;

    const commands = await CommandHistory.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(commands);
  } catch (err: any) {
    console.error('❌ GET /api/commands lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}