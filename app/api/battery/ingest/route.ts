import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BatteryTelemetry from '@/models/BatteryTelemetry';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voltage, current, soc, power, charging } = body;

    if (voltage == null || current == null) {
      return NextResponse.json({ error: 'Thiếu voltage hoặc current' }, { status: 400 });
    }

    await connectDB();

    await BatteryTelemetry.create({
      timestamp: new Date(),
      robotId:   'robot_01',
      voltage,
      current,
      soc,
      power,
      charging,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('❌ battery/ingest lỗi:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}