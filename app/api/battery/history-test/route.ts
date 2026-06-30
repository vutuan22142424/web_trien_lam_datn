// app/api/battery/history-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BatteryTelemetryTest from '@/models/BatteryTelemetryTest';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hours = Math.min(parseFloat(searchParams.get('hours') ?? '1'), 24);
    const ms    = hours * 60 * 60 * 1000;
    const since = new Date(Date.now() - ms);

    await connectDB();

    const docs = await BatteryTelemetryTest
      .find({ robotId: 'robot_test', timestamp: { $gte: since } })
      .sort({ timestamp: 1 })
      .select('timestamp voltage current soc -_id')
      .lean();

    const data = docs.map((d: any) => ({
      ts:      new Date(d.timestamp).getTime(),
      voltage: parseFloat(d.voltage.toFixed(3)),
      current: parseFloat(d.current.toFixed(3)),
      soc:     d.soc,
    }));

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}