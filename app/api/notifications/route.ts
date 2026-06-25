import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

    const items = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, message, meta } = body;

    if (!type || !message) {
      return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 });
    }

    await connectDB();

    // ── Chống spam ──
    // Mặc định: chặn theo `type` trong vòng 60s (vd: LOW_BATTERY — chỉ có 1
    // pin nên không cần phân biệt thêm).
    // Riêng DRAWER_JAM và DRAWER_RESOLVED: phải chặn theo CẶP (type,
    // meta.drawer), vì ngăn 1 và ngăn 2 là hai ngăn độc lập, không được coi
    // là trùng nhau chỉ vì cùng type.
    const dedupeFilter: Record<string, any> = {
      type,
      createdAt: { $gte: new Date(Date.now() - 60_000) },
    };
    if ((type === 'DRAWER_JAM' || type === 'DRAWER_RESOLVED') && meta?.drawer !== undefined) {
      dedupeFilter['meta.drawer'] = meta.drawer;
    }

    const recent = await Notification.findOne(dedupeFilter);
    if (recent) {
      return NextResponse.json(recent);
    }

    const doc = await Notification.create({ type, message, meta });
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE: xoá một thông báo theo id (?id=...), hoặc xoá toàn bộ lịch sử
// nếu không truyền id (?all=true) ──
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (id) {
      await Notification.findByIdAndDelete(id);
      return NextResponse.json({ success: true, deleted: id });
    }

    if (all === 'true') {
      const result = await Notification.deleteMany({});
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    }

    return NextResponse.json({ error: 'Thiếu id hoặc all=true' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}