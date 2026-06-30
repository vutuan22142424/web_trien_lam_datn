import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BatteryTelemetry from '@/models/BatteryTelemetry';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // const hours  = Math.min(parseInt(searchParams.get('hours') ?? '1'), 24);
    const hours = Math.min(parseFloat(searchParams.get('hours') ?? '1'), 24);
    const ms     = hours * 60 * 60 * 1000;
    const since  = new Date(Date.now() - ms);

    await connectDB();

    // Nếu <= 1 giờ: lấy điểm thô 5s
    // Nếu > 1 giờ: downsample theo phút
    let data: any[] = [];

    if (hours <= 1) {
      const docs = await BatteryTelemetry
        .find({ robotId: 'robot_01', timestamp: { $gte: since } })
        .sort({ timestamp: 1 })
        .select('timestamp voltage current soc -_id')
        .lean();

      // Fallback nếu robot off
      // Robot gửi dữ liệu mỗi 5 giây
const sampleIntervalSec = 5;

// Số điểm tương ứng với khoảng thời gian được chọn
const limit = Math.ceil(hours * 3600 / sampleIntervalSec);
      let finalDocs = docs;
      if (finalDocs.length === 0) {
        const fallbackDocs = await BatteryTelemetry
          .find({ robotId: 'robot_01' })
          .sort({ timestamp: -1 })
          .limit(limit)
          .select('timestamp voltage current soc -_id')
          .lean();
        finalDocs = fallbackDocs.reverse();
      }

      data = finalDocs.map((d: any) => ({
        ts:      new Date(d.timestamp).getTime(),
        voltage: parseFloat(d.voltage.toFixed(3)),
        current: parseFloat(d.current.toFixed(3)),
        soc:     d.soc,
      }));

    } else {
      // Downsample: trung bình mỗi phút qua aggregation
      const bucketMs = 60 * 1000; // 1 phút

      const pipeline = [
        {
          $match: {
            robotId:   'robot_01',
            timestamp: { $gte: since },
          },
        },
        {
          $group: {
            _id: {
              $subtract: [
                { $toLong: '$timestamp' },
                { $mod: [{ $toLong: '$timestamp' }, bucketMs] },
              ],
            },
            voltage: { $avg: '$voltage' },
            current: { $avg: '$current' },
            soc:     { $avg: '$soc' },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const docs = await BatteryTelemetry.aggregate(pipeline as any);

      data = docs.map((d: any) => ({
        ts:      d._id,
        voltage: parseFloat(d.voltage.toFixed(3)),
        current: parseFloat(d.current.toFixed(3)),
        soc:     d.soc != null ? parseFloat(d.soc.toFixed(1)) : null,
      }));
    }

    // Sắp xếp tăng dần theo thời gian (ts) để đảm bảo trục X tăng dần từ trái sang phải
    data.sort((a, b) => a.ts - b.ts);

    return NextResponse.json({ data });
  } catch (err) {
    console.error('❌ battery/history lỗi:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}