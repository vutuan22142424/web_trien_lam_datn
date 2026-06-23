import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function POST(req: NextRequest) {
  let command_id: string | undefined;
  let status: string | undefined;
  let eventId: string | undefined;

  try {
    const body = await req.json();
    command_id = body.command_id;
    status = body.status?.toUpperCase();
    eventId = body.eventId;

    await connectDB();

    if (!command_id || !status) {
      return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 });
    }

    const safeEventId = eventId ?? `${command_id}_${status}_${Date.now()}`;

    let finalDoc = await CommandHistory.findOneAndUpdate(
      {
        command_id,
        latestStatus: { $ne: status },
      },
      {
        $set: { latestStatus: status, updatedAt: new Date() },
        $push: { events: { status, timestamp: new Date(), eventId: safeEventId } },
        $setOnInsert: { createdAt: new Date() },
      },
      { new: true, upsert: true }
    );

    if (!finalDoc) {
      finalDoc = await CommandHistory.findOne({ command_id });
    }

    return NextResponse.json(finalDoc);
  } catch (err: any) {
    if (err?.code === 11000 && command_id) {
      try {
        const doc = await CommandHistory.findOne({ command_id });
        return NextResponse.json(doc);
      } catch {}
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}