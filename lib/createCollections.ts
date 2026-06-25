import mongoose from 'mongoose';

export async function ensureBatteryCollection() {
  const db = mongoose.connection.db;
  if (!db) return;

  try {
    await db.createCollection('battery_telemetry', {
      timeseries: {
        timeField:   'timestamp',
        metaField:   'robotId',
        granularity: 'seconds',
      },
      expireAfterSeconds: 60 * 60 * 24 * 7,
    });
    console.log('✅ Đã tạo Time Series Collection: battery_telemetry');
  } catch (err: any) {
    if (err?.codeName === 'NamespaceExists') {
      // Collection đã tồn tại — bình thường, bỏ qua
      return;
    }
    // Lỗi thật sự khác → ném ra để connectDB biết
    throw err;
  }
}