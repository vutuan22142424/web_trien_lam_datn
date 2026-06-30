const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- Cấu hình Mặc định / Default Configurations ---
const MODE = process.argv.includes('--test') ? 'test' : 'prod';
const ROBOT_ID = MODE === 'test' ? 'robot_test' : 'robot_01';
const COLLECTION_NAME = MODE === 'test' ? 'battery_telemetry_test' : 'battery_telemetry';
const INTERVAL_MS = 5000; // 5 giây gửi một lần

// Đọc MONGODB_URI từ .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      mongodbUri = trimmed.substring('MONGODB_URI='.length).trim();
      // Loại bỏ dấu nháy kép hoặc đơn xung quanh (nếu có)
      if (mongodbUri.startsWith('"') && mongodbUri.endsWith('"')) {
        mongodbUri = mongodbUri.slice(1, -1);
      }
      if (mongodbUri.startsWith("'") && mongodbUri.endsWith("'")) {
        mongodbUri = mongodbUri.slice(1, -1);
      }
      break;
    }
  }
}

if (!mongodbUri) {
  console.error("❌ Không tìm thấy biến môi trường MONGODB_URI trong file .env.local!");
  console.log("Vui lòng kiểm tra lại cấu hình file .env.local ở thư mục gốc.");
  process.exit(1);
}

// Khởi tạo Schema
const telemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  robotId:   { type: String, required: true },
  voltage:   { type: Number, required: true },
  current:   { type: Number, required: true },
  soc:       { type: Number },
  power:     { type: Number },
  charging:  { type: Boolean },
});

// Định nghĩa Model tương ứng với Collection mong muốn
const BatteryTelemetryModel = mongoose.models[COLLECTION_NAME] || 
  mongoose.model(COLLECTION_NAME, telemetrySchema, COLLECTION_NAME);

// Biến lưu trạng thái mô phỏng pin
let currentSoc = 80.0;    // SoC bắt đầu từ 80%
let isCharging = false;   // Trạng thái sạc/xả ban đầu

async function main() {
  console.log('🔌 Đang kết nối tới cơ sở dữ liệu MongoDB...');
  try {
    await mongoose.connect(mongodbUri);
    console.log('✅ Kết nối MongoDB thành công!');
    console.log('--------------------------------------------------');
    console.log(`📡 CHẾ ĐỘ GIẢ LẬP: [${MODE.toUpperCase()}]`);
    console.log(`🤖 Robot ID:       [${ROBOT_ID}]`);
    console.log(`🗃️ Collection:     [${COLLECTION_NAME}]`);
    console.log(`⏱️ Tần suất gửi:   Mỗi ${INTERVAL_MS / 1000} giây một điểm dữ liệu`);
    console.log('--------------------------------------------------');
    console.log('💡 Gợi ý chạy:');
    console.log('   - Chạy giả lập test: npm run simulate -- --test');
    console.log('   - Chạy giả lập prod (mặc định): npm run simulate');
    console.log('Nhấn Ctrl+C để dừng mô phỏng.\n');

    // Chạy điểm đầu tiên ngay lập tức
    await sendTelemetryPoint();

    // Lặp lại mỗi 5 giây
    const timer = setInterval(sendTelemetryPoint, INTERVAL_MS);

    process.on('SIGINT', async () => {
      clearInterval(timer);
      console.log('\n🔌 Đang đóng kết nối MongoDB...');
      await mongoose.disconnect();
      console.log('👋 Đã dừng mô phỏng thành công.');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động giả lập:', error);
    process.exit(1);
  }
}

async function sendTelemetryPoint() {
  try {
    // --- Tính toán mô phỏng trạng thái pin thực tế ---
    if (isCharging) {
      // Đang sạc: Pin tăng từ 0.05% đến 0.15% mỗi 5s
      currentSoc += 0.05 + Math.random() * 0.1;
      if (currentSoc >= 99.0) {
        currentSoc = 99.0;
        isCharging = false;
        console.log('\n🔋 Pin đã đầy (>=99%). Chuyển sang chế độ XẢ (Discharging).');
      }
    } else {
      // Đang xả: Pin giảm từ 0.03% đến 0.09% mỗi 5s
      currentSoc -= 0.03 + Math.random() * 0.06;
      if (currentSoc <= 15.0) {
        currentSoc = 15.0;
        isCharging = true;
        console.log('\n🪫 Pin yếu (<=15%). Chuyển sang chế độ SẠC (Charging).');
      }
    }

    // Điện áp (Voltage) thay đổi theo dung lượng pin còn lại (SoC)
    // Dải điện áp khoảng từ 21.2V (yếu) đến 24.5V (đầy)
    const baseVoltage = 21.2 + (currentSoc / 100) * 3.3;
    const voltage = parseFloat((baseVoltage + (Math.random() - 0.5) * 0.05).toFixed(3));

    // Dòng điện (Current) thay đổi tùy theo chế độ sạc/xả
    let current = 0;
    if (isCharging) {
      // Sạc: Dòng điện âm (-1.8A đến -2.5A)
      current = parseFloat((-2.2 + (Math.random() - 0.5) * 0.3).toFixed(3));
    } else {
      // Xả: Dòng điện dương (Tải ngẫu nhiên của động cơ/thiết bị từ 0.35A đến 1.1A)
      current = parseFloat((0.7 + (Math.random() - 0.5) * 0.45).toFixed(3));
    }

    // Công suất (Power) = Voltage * Current
    const power = parseFloat((voltage * current).toFixed(2));

    const timestamp = new Date();

    // Lưu dữ liệu vào collection đã chọn
    const doc = await BatteryTelemetryModel.create({
      timestamp,
      robotId: ROBOT_ID,
      voltage,
      current,
      soc: parseFloat(currentSoc.toFixed(2)),
      power,
      charging: isCharging,
    });

    const timeStr = timestamp.toLocaleTimeString('vi-VN');
    const stateEmoji = isCharging ? '⚡🔋' : '🔌🚗';
    console.log(
      `[${timeStr}] ${stateEmoji} SoC: ${doc.soc.toFixed(2)}% | Áp: ${doc.voltage} V | Dòng: ${doc.current} A | Công suất: ${doc.power} W`
    );

  } catch (error) {
    console.error('❌ Lỗi lưu dữ liệu:', error.message);
  }
}

main();
