'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, BatteryWarning, PackageX, PackageCheck, X } from 'lucide-react';

interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  meta?: any;
  createdAt: string;
}

interface AppNotification {
  type: string;
  message: string;
  meta?: any;
}

const TYPE_ICON: Record<string, typeof Bell> = {
  LOW_BATTERY:     BatteryWarning,
  DRAWER_JAM:      PackageX,
  DRAWER_RESOLVED: PackageCheck,
};

export function NotificationBell({ latest }: { latest: AppNotification | null }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [toast, setToast]     = useState<AppNotification | null>(null);
  const lastShownRef = useRef<string | null>(null);

  // Số thông báo chưa đọc — tăng mỗi khi có thông báo mới (latest đổi),
  // về 0 khi người dùng mở dialog xem (isOpen = true).
  const [unreadCount, setUnreadCount] = useState(0);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  useEffect(() => {
    if (!latest) return;
    const key = `${latest.type}_${JSON.stringify(latest.meta)}`;
    if (lastShownRef.current === key) return;
    lastShownRef.current = key;

    setToast(latest);
    setUnreadCount(c => c + 1);
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [latest]);

  const loadHistory = () => {
    fetch('/api/notifications?limit=50')
      .then(r => r.json())
      .then(d => setHistory(Array.isArray(d) ? d : []))
      .catch(() => setHistory([]));
  };

  useEffect(() => {
    if (!isOpen) return;
    // Người dùng đã mở xem — coi như đã đọc hết, reset badge.
    setUnreadCount(0);
    loadHistory();
  }, [isOpen, latest]);

  const deleteOne = (id: string) => {
    // Xoá ngay trên UI trước (optimistic), không cần chờ server phản hồi
    setHistory(prev => prev.filter(item => item._id !== id));
    fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
      .catch(err => console.error('❌ Xoá thông báo lỗi:', err));
  };

  const deleteAll = () => {
    setShowClearAllConfirm(false);
    setHistory([]);
    fetch('/api/notifications?all=true', { method: 'DELETE' })
      .catch(err => console.error('❌ Xoá toàn bộ thông báo lỗi:', err));
  };

  return (
    <>
      {/* ── Toast tạm biến mất ── */}
      {toast && (
        <div className={`fixed top-24 right-4 z-[500] w-80 rounded-2xl border p-4 shadow-2xl ${
          toast.type === 'DRAWER_RESOLVED' ? 'border-emerald-200 bg-white' : 'border-rose-200 bg-white'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
              toast.type === 'DRAWER_RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {(() => { const Icon = TYPE_ICON[toast.type] ?? Bell; return <Icon className="h-4 w-4" />; })()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-950">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Icon chuông + badge số chưa đọc ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative grid h-7 w-7 place-items-center rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
      >
        <Bell className="h-4 w-4" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-black leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dialog FULL MÀN HÌNH ── */}
      {isOpen && (
  <div
    className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-4"
    style={{ minHeight: '100dvh' }}
    onClick={() => setIsOpen(false)}
  >
    <div
      className="w-full max-w-lg max-h-[75dvh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-black text-slate-950">Thông báo hệ thống</h3>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Xoá tất cả
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">Chưa có thông báo nào</p>
          ) : (
            history.map(item => {
              const Icon = TYPE_ICON[item.type] ?? Bell;
              const isResolved = item.type === 'DRAWER_RESOLVED';
              return (
                <div key={item._id} className="group flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    isResolved ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-950">{item.message}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteOne(item._id)}
                    title="Xoá thông báo này"
                    className="shrink-0 grid h-7 w-7 place-items-center rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* ── Confirm xoá tất cả ── */}
      {showClearAllConfirm && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowClearAllConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-slate-950 text-center mb-2">Xoá tất cả thông báo?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Toàn bộ lịch sử thông báo sẽ bị xoá vĩnh viễn và không thể khôi phục.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={deleteAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors"
              >
                Xoá tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
