import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BatteryTelemetry from '@/models/BatteryTelemetry';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const points = Math.min(parseInt(searchParams.get('points') ?? '60'), 200);

    await connectDB();

    const docs = await BatteryTelemetry
      .find({ robotId: 'robot_01' })
      .sort({ timestamp: -1 })       // mới nhất trước
      .limit(points)
      .select('timestamp voltage current soc -_id')
      .lean();

    // Đảo lại để chart hiển thị trái → phải theo thời gian
    const data = docs.reverse().map((d: any) => ({
      time:    new Date(d.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      voltage: parseFloat(d.voltage.toFixed(3)),
      current: parseFloat(d.current.toFixed(3)),
      soc:     d.soc,
    }));

    return NextResponse.json({ data });
  } catch (err) {
    console.error('❌ battery/history lỗi:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}