'use client';

import {
  Activity,
  ArrowRight,
  Bot,
  DoorOpen,
  Toilet,
} from 'lucide-react';
import type { CSSProperties } from 'react';

type Booth = {
  id: string;
  name: string;
  brand: string;
  desc: string;
  logo: string;
  visitors: number;
  accent: string;
  deep: string;
  soft: string;
  image: string;
};

const sharedBoothImage = '/images/exhibition-hall.png';

const booths: Booth[] = [
  {
    id: '01',
    name: 'Coca-Cola Experience Hub',
    brand: 'Coca-Cola',
    desc: 'Trải nghiệm cá nhân hóa đồ uống bằng AI.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coca-cola.com&size=128',
    visitors: 42,
    accent: '#dc1725',
    deep: '#7f1017',
    soft: '#fff1f2',
    image: '/images/cocacola-booth.png',
  },
  {
    id: '02',
    name: 'Pepsi Interactive Lab',
    brand: 'Pepsi',
    desc: 'Tương tác thông minh, kết nối khách hàng.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://pepsi.com&size=128',
    visitors: 38,
    accent: '#1357c8',
    deep: '#072c61',
    soft: '#eff6ff',
    image: sharedBoothImage,
  },
  {
    id: '03',
    name: 'Heineken Future Brewing',
    brand: 'Heineken',
    desc: 'Công nghệ ủ bia bền vững và thông minh.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://heineken.com&size=128',
    visitors: 31,
    accent: '#0b8c45',
    deep: '#064829',
    soft: '#ecfdf5',
    image: sharedBoothImage,
  },
  {
    id: '04',
    name: 'Tiger Smart Distribution',
    brand: 'Tiger',
    desc: 'Logistics thông minh, tối ưu chuỗi cung ứng.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tigerbeer.com&size=128',
    visitors: 27,
    accent: '#d88211',
    deep: '#0f2a55',
    soft: '#fff7ed',
    image: sharedBoothImage,
  },
  {
    id: '05',
    name: 'Sabeco Industry Pavilion',
    brand: 'SABECO',
    desc: 'Đổi mới ngành đồ uống Việt Nam với công nghệ.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sabeco.com.vn&size=128',
    visitors: 22,
    accent: '#b88405',
    deep: '#5f4201',
    soft: '#fffbeb',
    image: sharedBoothImage,
  },
  {
    id: '06',
    name: 'Abbott Healthcare Innovation',
    brand: 'Abbott',
    desc: 'Giải pháp chăm sóc sức khỏe tiên tiến.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://abbott.com&size=128',
    visitors: 19,
    accent: '#159bd3',
    deep: '#075985',
    soft: '#f0f9ff',
    image: sharedBoothImage,
  },
  {
    id: '07',
    name: 'Nutifood Nutrition Tech Lab',
    brand: 'Nutifood',
    desc: 'Dinh dưỡng cá nhân hóa dựa trên dữ liệu sức khỏe.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://nutifood.com.vn&size=128',
    visitors: 15,
    accent: '#0c9b61',
    deep: '#065f46',
    soft: '#ecfdf5',
    image: sharedBoothImage,
  },
  {
    id: '08',
    name: 'Vinamilk DairyTech Future Zone',
    brand: 'Vinamilk',
    desc: 'Công nghệ sản xuất sữa thông minh thế hệ mới.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://vinamilk.com.vn&size=128',
    visitors: 18,
    accent: '#1655d9',
    deep: '#132f74',
    soft: '#eff6ff',
    image: sharedBoothImage,
  },
];

function ExpoLight({ className = '' }: { className?: string }) {
  return <span className={`expo-floor-light ${className}`} />;
}

function UtilityBlock() {
  return (
    <div className="expo-utility-panel">
      <div className="grid h-16 w-16 place-items-center rounded-[0.65rem] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.16)]">
        <Toilet className="h-7 w-7 text-slate-900" strokeWidth={1.8} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-700">Khu vệ sinh</span>
    </div>
  );
}

function EntryGate({ label, align = 'left' }: { label: string; align?: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
      <div className="grid h-14 w-8 place-items-center rounded-[0.35rem] border border-cyan-200 bg-white shadow-[0_8px_20px_rgba(14,165,233,0.18),inset_0_0_0_4px_rgba(14,165,233,0.08)]">
        <DoorOpen className="h-4 w-4 text-cyan-700" />
      </div>
      <div className="grid h-14 w-8 place-items-center rounded-[0.35rem] border border-cyan-200 bg-white shadow-[0_8px_20px_rgba(14,165,233,0.18),inset_0_0_0_4px_rgba(14,165,233,0.08)]">
        <DoorOpen className="h-4 w-4 text-cyan-700" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</span>
    </div>
  );
}

function RobotGuide({ className = '' }: { className?: string }) {
  return (
    <div className={`expo-robot ${className}`} aria-label="Robot guide">
      <div className="expo-robot-core">
        <Bot className="h-5 w-5" />
      </div>
    </div>
  );
}

function BoothCard({ booth }: { booth: Booth }) {
  const style = {
    '--booth-accent': booth.accent,
    '--booth-deep': booth.deep,
    '--booth-soft': booth.soft,
    '--booth-image': `url(${booth.image})`,
  } as CSSProperties;

  return (
    <article className="expo-booth motion-card group min-h-[178px]" style={style}>
      <span className="absolute left-3 top-4 z-[2] font-mono text-sm font-black leading-none text-white/92 tabular-nums">
        {booth.id}
      </span>
      <div className="grid h-full grid-cols-[0.4fr_0.6fr] gap-3">
        <div className="expo-booth-scene">
          <div className="expo-booth-logo-plate">
            <img src={booth.logo} alt={`${booth.brand} logo`} className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col py-3 pr-2">
          <h3 className="text-[15px] font-black leading-tight text-white drop-shadow-sm">{booth.brand}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-white/90">{booth.name}</p>
          <p className="mt-3 line-clamp-2 text-[11px] font-medium leading-5 text-white/72">{booth.desc}</p>
          <button className="mt-auto inline-flex w-max items-center gap-2 rounded-[0.35rem] border border-white/22 bg-white/12 px-3 py-1.5 text-[10px] font-black text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 active:scale-[0.98]">
            Khám phá
            <ArrowRight className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function VirtualExpo() {
  const topBooths = booths.slice(0, 5);
  const bottomBooths = booths.slice(5);

  return (
    <section id="trien-lam" className="expo-map-section relative overflow-hidden pb-8 pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties} className="min-w-0">
          <div className="overflow-x-auto border border-slate-200 bg-white p-2 shadow-[0_22px_54px_rgba(15,23,42,0.14)]">
            <div className="expo-floor-shell min-w-[1280px] p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.02em] text-white">Sơ đồ triển lãm</h2>
                  <p className="mt-1 text-xs font-medium text-slate-300">Click vào gian hàng để khám phá.</p>
                </div>

                <div className="flex w-max items-center gap-2 rounded-[0.35rem] border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                  <Activity className="h-3.5 w-3.5" />
                  LIVE
                </div>
              </div>

              <div className="grid grid-cols-[150px_repeat(5,minmax(0,1fr))] gap-2">
                <UtilityBlock />
                {topBooths.map((booth) => (
                  <BoothCard key={booth.id} booth={booth} />
                ))}
              </div>

              <div className="expo-corridor relative my-2 min-h-[88px] overflow-hidden border-y-4 border-[#173f48]/95 bg-white">
                <div className="expo-floor-grid absolute inset-0" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <EntryGate label="Vào cổng" />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <EntryGate label="Ra cổng" align="right" />
                </div>

                <ExpoLight className="left-[11%] top-0" />
                <ExpoLight className="left-[33%] bottom-0" />
                <ExpoLight className="left-[47%] top-0" />
                <ExpoLight className="right-[32%] bottom-0" />
                <ExpoLight className="right-[12%] top-0" />

                <div className="absolute left-[18%] top-1/2 hidden -translate-y-1/2 gap-1 text-5xl font-black text-blue-500/32 md:flex">
                  <span>&rsaquo;</span>
                  <span>&rsaquo;</span>
                </div>
                <div className="absolute right-[17%] top-1/2 hidden -translate-y-1/2 gap-1 text-5xl font-black text-blue-500/32 md:flex">
                  <span>&lsaquo;</span>
                  <span>&lsaquo;</span>
                </div>

                <RobotGuide className="left-[36%] top-1/2" />
                <RobotGuide className="right-[27%] top-1/2" />

                <div className="absolute left-1/2 top-1/2 flex w-[330px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[0.35rem] border border-cyan-200/60 bg-[#718193]/88 px-5 py-2.5 text-center text-white shadow-[0_14px_32px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.08em]">Smart Guided Experience Lane</p>
                    <p className="mt-1 text-[10px] font-medium text-cyan-50/78">Hệ thống dẫn đường tự động đang hoạt động</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {bottomBooths.map((booth) => (
                  <BoothCard key={booth.id} booth={booth} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
