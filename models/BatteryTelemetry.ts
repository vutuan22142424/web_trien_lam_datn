import mongoose from 'mongoose';

const batteryTelemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },   // timeField
  robotId:   { type: String, default: 'robot_01' }, // metaField
  voltage:   { type: Number, required: true },
  current:   { type: Number, required: true },
  soc:       { type: Number },
  power:     { type: Number },
  charging:  { type: Boolean },
});

// Không tạo index TTL thủ công — Time Series Collection tự quản lý
// bằng expireAfterSeconds khi tạo collection (xem lib/createCollections.ts)

export default mongoose.models.BatteryTelemetry ||
  mongoose.model('BatteryTelemetry', batteryTelemetrySchema, 'battery_telemetry');