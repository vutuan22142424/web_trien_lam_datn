import mongoose from 'mongoose';
import { ensureBatteryCollection } from './createCollections';

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose ?? { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(async (m) => {
      await ensureBatteryCollection(); // tạo collection nếu chưa có
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}