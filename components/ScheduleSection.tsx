'use client';

import { useMemo, type CSSProperties } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Mic,
  Trophy,
  Users as UsersIcon,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';

const iconMap: Record<string, LucideIcon> = {
  Users: UsersIcon,
  Mic,
  MapPin,
  CalendarDays,
  Utensils,
  Trophy,
};

function getAccentStyle(accent?: string): CSSProperties {
  const color = /^#[0-9a-f]{6}$/i.test(accent ?? '') ? accent! : '#2563eb';

  return {
    color,
    borderColor: `${color}22`,
    backgroundColor: `${color}10`,
  };
}

function formatTimeRange(time: string, end: string) {
  return [time, end].filter(Boolean).join(' – ');
}

function ScheduleSkeleton() {
  return (
    <div className="grid gap-2 p-2 sm:p-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid min-h-24 animate-pulse gap-4 rounded-2xl bg-slate-50 px-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:px-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white" />
            <div className="h-3 w-28 rounded-full bg-slate-200" />
          </div>
          <div>
            <div className="h-4 w-64 max-w-full rounded-full bg-slate-200" />
            <div className="mt-3 h-3 w-80 max-w-full rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScheduleSection() {
  const { schedules, loading, error } = useSchedules();
  const sortedSchedules = useMemo(
    () => [...schedules].sort((a, b) => a.time.localeCompare(b.time)),
    [schedules],
  );

  const hasScrollableAgenda = loading || sortedSchedules.length > 5;

  return (
    <section id="lich-trinh" className="expo-section-light relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Lịch trình sự kiện
            </h2>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Chương trình ngày 15 tháng 6, 2026
            </p>
          </div>

          {!loading && !error && sortedSchedules.length > 0 ? (
            <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs font-bold text-blue-700">
              <Clock className="h-3.5 w-3.5" />
              {sortedSchedules.length} hoạt động trong ngày
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(30,64,175,0.10)]">
          <div className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)]">
                <CalendarDays className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-950">Agenda trong ngày</p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                  Thời gian, diễn giả và địa điểm
                </p>
              </div>
            </div>

            {hasScrollableAgenda ? (
              <div className="hidden items-center gap-1.5 text-[11px] font-bold text-slate-400 sm:flex">
                Cuộn để xem thêm
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div
              className={`schedule-scroll overflow-y-auto overscroll-contain p-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:p-3 ${
                hasScrollableAgenda ? 'h-[31rem] sm:h-[35rem]' : ''
              }`}
              tabIndex={0}
              role="region"
              aria-label="Danh sách lịch trình sự kiện, có thể cuộn"
            >
              {loading && sortedSchedules.length === 0 ? <ScheduleSkeleton /> : null}

              {!loading && error ? (
                <div className="m-2 rounded-2xl bg-red-50 px-4 py-5 text-sm font-bold text-red-700">
                  Không thể tải lịch trình từ hệ thống.
                </div>
              ) : null}

              {!loading && !error && sortedSchedules.length === 0 ? (
                <div className="m-2 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-bold text-slate-500">
                  Chưa có lịch trình sự kiện.
                </div>
              ) : null}

              {!loading && !error && sortedSchedules.length > 0 ? (
                <ol className="divide-y divide-slate-100">
                  {sortedSchedules.map((item, index) => {
                    const EventIcon = iconMap[item.icon] ?? Clock;
                    const accentStyle = getAccentStyle(item.accent);

                    return (
                      <li
                        key={item.id ?? `${item.time}-${item.label}`}
                        className="group grid min-h-24 gap-3 rounded-2xl px-3 py-4 transition-colors duration-200 hover:bg-slate-50/90 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-5 sm:px-5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-transform duration-200 group-hover:-translate-y-0.5"
                            style={accentStyle}
                          >
                            <EventIcon className="h-[17px] w-[17px]" strokeWidth={2.2} />
                            <span className="absolute -left-[1.15rem] top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600 sm:block" />
                          </div>
                          <div>
                            <span className="block font-mono text-xs font-black tracking-[-0.02em] text-slate-800 tabular-nums">
                              {formatTimeRange(item.time, item.end)}
                            </span>
                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Mục {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 pl-[3.25rem] sm:pl-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-sm font-black leading-snug text-slate-950 sm:text-[15px]">
                              {item.label}
                            </h3>
                            {item.duration ? (
                              <span
                                className="rounded-md border px-2 py-1 text-[10px] font-black"
                                style={accentStyle}
                              >
                                {item.duration}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-medium text-slate-500">
                            {item.speaker ? (
                              <span className="flex min-w-0 max-w-full items-start gap-1.5">
                                <UsersIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="min-w-0">{item.speaker}</span>
                              </span>
                            ) : null}
                            <span className="flex min-w-0 max-w-full items-start gap-1.5">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span className="min-w-0">{item.detail}</span>
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </div>

            {hasScrollableAgenda ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
