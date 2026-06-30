import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BatteryTelemetryTest from '@/models/BatteryTelemetryTest';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const minutes = Math.min(parseInt(searchParams.get('minutes') ?? '5', 10), 60);
    const points = Math.floor((minutes * 60) / 5);

    await BatteryTelemetryTest.deleteMany({ robotId: 'robot_test' });

    const now = Date.now();

    // ── Pin xả dần theo thời gian ──
    const VOLTAGE_START = 24.0;   // V lúc đầy/bắt đầu quan sát
    const VOLTAGE_END   = 21.5;   // V lúc gần cạn (cuối khoảng test)
    const CURRENT_START = 0.6;    // A lúc đầu (tải nhẹ)
    const CURRENT_END   = 0.35;   // A lúc cuối (dòng giảm khi áp giảm)
    const SOC_START     = 60;
    const SOC_END       = 20;

    const docs = Array.from({ length: points }, (_, i) => {
      const t = now - (points - i) * 5000;
      const progress = i / (points - 1); // 0 → 1, tiến trình theo thời gian

      const voltage = VOLTAGE_START - (VOLTAGE_START - VOLTAGE_END) * progress
        + (Math.random() - 0.5) * 0.03; // nhiễu nhỏ cho thật

      const current = CURRENT_START - (CURRENT_START - CURRENT_END) * progress
        + (Math.random() - 0.5) * 0.015;

      const soc = SOC_START - (SOC_START - SOC_END) * progress;

      return {
        timestamp: new Date(t),
        robotId:   'robot_test',
        voltage:   parseFloat(voltage.toFixed(3)),
        current:   parseFloat(current.toFixed(3)),
        soc:       parseFloat(soc.toFixed(2)),
        power:     parseFloat((voltage * current).toFixed(2)),
        charging:  false,
      };
    });

    await BatteryTelemetryTest.insertMany(docs);

    return NextResponse.json({ ok: true, inserted: docs.length });
  } catch (err: any) {
    console.error('❌ seed-test lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}