const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.resolve(__dirname, '../.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      mongodbUri = trimmed.substring('MONGODB_URI='.length).trim();
      break;
    }
  }
}

const batteryTelemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  robotId:   { type: String, default: 'robot_01' },
  voltage:   { type: Number, required: true },
  current:   { type: Number, required: true },
  soc:       { type: Number },
  power:     { type: Number },
  charging:  { type: Boolean },
});

const BatteryTelemetryTest = mongoose.models.BatteryTelemetryTest || 
  mongoose.model('BatteryTelemetryTest', batteryTelemetrySchema, 'battery_telemetry_test');

async function main() {
  await mongoose.connect(mongodbUri);
  console.log('Connected to DB');

  const stats = await BatteryTelemetryTest.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  console.log('Document counts per day in battery_telemetry_test:');
  console.log(stats);

  await mongoose.disconnect();
}

main();
