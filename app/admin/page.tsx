'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BatteryCharging, Bot, CalendarDays, ExternalLink, LayoutDashboard, LogOut, MapPin, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import analytics from '@/public/data/analytics.json';
import robot from '@/public/data/robot.json';
import { ExhibitionTab } from '@/components/tabs/ExhibitionTab';
import { ScheduleTab } from '@/components/tabs/ScheduleTab';

type AdminTab = 'exhibition' | 'schedule';

const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'exhibition', label: 'Điều phối triển lãm', icon: LayoutDashboard },
  { id: 'schedule', label: 'Lịch sự kiện', icon: CalendarDays },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('exhibition');
  const batterySoc = Math.max(0, Math.min(100, Math.round(robot.telemetry.battery.soc)));
  const batteryBarClass = robot.telemetry.battery.charging
    ? 'from-sky-500 via-blue-500 to-cyan-400'
    : batterySoc <= 20
      ? 'from-rose-500 via-red-500 to-orange-400'
      : batterySoc <= 45
        ? 'from-amber-500 via-yellow-500 to-orange-400'
        : 'from-emerald-500 via-teal-500 to-blue-500';

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[#f3f7fb] text-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(242,247,252,0.78)_42%,rgba(230,238,247,0.68)_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-56 bg-[linear-gradient(90deg,rgba(37,99,235,0.12),rgba(16,185,129,0.10),rgba(15,23,42,0.04))]" />

      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#f8fbff]/88 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto grid min-h-20 max-w-[1500px] gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] bg-slate-950 text-white shadow-[0_18px_38px_rgba(15,23,42,0.18)]">
              <Bot className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Future Consumer Expo</p>
              <h1 className="text-balance text-xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-2xl xl:text-xl 2xl:text-2xl">
                Bảng điều khiển quản trị
              </h1>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[540px]">
            <div className="rounded-[1rem] border border-slate-200 bg-white/88 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-[0.75rem] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Radio className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Kết nối</p>
                  <p className="truncate text-xs font-black text-slate-950">{robot.mqtt.connection}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1rem] border border-slate-200 bg-white/88 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-[0.75rem] bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <BatteryCharging className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Pin robot</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="font-mono text-xs font-black tabular-nums text-slate-950">{batterySoc}%</p>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn('h-full rounded-full bg-gradient-to-r', batteryBarClass)} style={{ width: `${batterySoc}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1rem] border border-slate-200 bg-white/88 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-[0.75rem] bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                  <MapPin className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Khu vực</p>
                  <p className="truncate text-xs font-black text-slate-950">{robot.position.zone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/"
              className="group inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 active:translate-y-0 sm:px-4 sm:text-sm"
            >
              Xem trang công khai
              <ExternalLink className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-10 min-w-0 rounded-full border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-slate-950 hover:text-white active:translate-y-0 sm:px-4 sm:text-sm"
            >
              <LogOut className="mr-2 h-4 w-4" strokeWidth={1.8} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:py-8">
        <nav className="mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-[0_16px_42px_rgba(15,23,42,0.07)] ring-1 ring-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-black transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]',
                  isActive
                    ? 'bg-slate-950 text-white shadow-[0_12px_26px_rgba(15,23,42,0.18)]'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === 'exhibition' ? <ExhibitionTab analytics={analytics} robot={robot} /> : <ScheduleTab />}
      </main>

      <footer className="relative z-10 mx-auto mt-10 max-w-[1500px] px-4 pb-8 text-xs font-semibold text-slate-400 sm:px-6">
        <div className="border-t border-slate-200 pt-5">
          Future Consumer Expo Admin Panel · 2026
        </div>
      </footer>
    </div>
  );
}
