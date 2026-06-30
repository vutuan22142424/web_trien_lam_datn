// models/BatteryTelemetryTest.ts
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  robotId:   { type: String, required: true },
  voltage:   { type: Number, required: true },
  current:   { type: Number, required: true },
  soc:       { type: Number },
  power:     { type: Number },
  charging:  { type: Boolean },
});

export default mongoose.models.BatteryTelemetryTest ||
  mongoose.model('BatteryTelemetryTest', schema, 'battery_telemetry_test');