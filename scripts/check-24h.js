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

const BatteryTelemetry = mongoose.models.BatteryTelemetry || 
  mongoose.model('BatteryTelemetry', batteryTelemetrySchema, 'battery_telemetry');

async function main() {
  await mongoose.connect(mongodbUri);
  console.log('Connected to DB');

  const hours = 24;
  const ms = hours * 60 * 60 * 1000;
  const since = new Date(Date.now() - ms);

  console.log(`Querying since: ${since.toISOString()} (Local: ${since.toLocaleString('vi-VN')})`);

  const docs = await BatteryTelemetry
    .find({ robotId: 'robot_01', timestamp: { $gte: since } })
    .sort({ timestamp: 1 })
    .select('timestamp voltage current soc -_id')
    .lean();

  console.log(`Found ${docs.length} docs in the last 24 hours.`);
  if (docs.length > 0) {
    console.log('First doc:', docs[0]);
    console.log('Last doc:', docs[docs.length - 1]);
  }

  await mongoose.disconnect();
}

main();
