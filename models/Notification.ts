import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type:      { type: String, required: true },   // 'LOW_BATTERY' | 'DRAWER_JAM'
  message:   { type: String, required: true },
  meta:      { type: mongoose.Schema.Types.Mixed },  // dữ liệu kèm theo (vd: soc, drawerId)
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema, 'notifications');