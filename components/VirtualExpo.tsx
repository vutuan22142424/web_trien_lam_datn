'use client';

import { SELECT_EXPO_BOOTH_EVENT, type SelectExpoBoothEventDetail } from '@/lib/expoEvents';
import { ArrowRight, Bot, DoorOpen, MoveHorizontal, Toilet } from 'lucide-react';
import type { CSSProperties } from 'react';

type Booth = {
  id: string;
  name: string;
  brand: string;
  desc: string;
  logo: string;
  accent: string;
  deep: string;
  image: string;
  className: string;
  variant?: 'top' | 'bottom';
};

const booths: Booth[] = [
  {
    id: '01',
    name: 'Coca-Cola Experience Hub',
    brand: 'Coca-Cola',
    desc: 'Trải nghiệm cá nhân hóa đồ uống bằng AI.',
    logo: '/logos/booths/coca-cola.svg',
    accent: '#dc1725',
    deep: '#68141a',
    image: '/images/booths/cocacola.webp',
    className: 'left-[150px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '02',
    name: 'Pepsi Interactive Lab',
    brand: 'Pepsi',
    desc: 'Tương tác thông minh, kết nối khách hàng.',
    logo: '/logos/booths/pepsi.svg',
    accent: '#1357c8',
    deep: '#082345',
    image: '/images/booths/pepsi.webp',
    className: 'left-[352px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '03',
    name: 'Red Bull Energy Lab',
    brand: 'Red Bull',
    desc: 'Công nghệ marketing thông minh và vending machine AI.',
    logo: '/logos/booths/redbull.svg',
    accent: '#f5c400',
    deep: '#0d2f72',
    image: '/images/booths/redbull.svg',
    className: 'left-[554px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '04',
    name: 'Heineken Future Brewing',
    brand: 'Heineken',
    desc: 'Công nghệ ủ bia bền vững và thông minh.',
    logo: '/logos/booths/heineken.svg',
    accent: '#0b8c45',
    deep: '#05321e',
    image: '/images/booths/heineken.webp',
    className: 'left-[756px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '05',
    name: 'Tiger Smart Distribution',
    brand: 'Tiger',
    desc: 'Logistics thông minh, tối ưu chuỗi cung ứng.',
    logo: '/logos/booths/tiger.svg',
    accent: '#d88211',
    deep: '#092b54',
    image: '/images/booths/tiger.webp',
    className: 'left-[958px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '06',
    name: 'Sabeco Industry Pavilion',
    brand: 'Sabeco',
    desc: 'Đổi mới ngành đồ uống Việt Nam với công nghệ.',
    logo: '/logos/booths/sabeco.svg',
    accent: '#b88405',
    deep: '#102139',
    image: '/images/booths/sabeco.webp',
    className: 'left-[1160px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '07',
    name: 'Abbott Healthcare Innovation',
    brand: 'Abbott',
    desc: 'Giải pháp chăm sóc sức khỏe tiên tiến.',
    logo: '/logos/booths/abbott.svg',
    accent: '#159bd3',
    deep: '#075985',
    image: '/images/booths/abbott.webp',
    className: 'left-[190px] top-[224px] h-[122px] w-[270px]',
    variant: 'bottom',
  },
  {
    id: '08',
    name: 'Nutifood Nutrition Tech Lab',
    brand: 'Nutifood',
    desc: 'Dinh dưỡng cá nhân hóa dựa trên dữ liệu sức khỏe.',
    logo: '/logos/booths/nutifood.svg',
    accent: '#0c9b61',
    deep: '#065f46',
    image: '/images/booths/nutifood.webp',
    className: 'left-[484px] top-[224px] h-[122px] w-[270px]',
    variant: 'bottom',
  },
  {
    id: '09',
    name: 'Nestlé Smart Food Innovation',
    brand: 'Nestlé',
    desc: 'Sản xuất thực phẩm thông minh và kiểm định bằng AI.',
    logo: '/logos/booths/nestle.svg',
    accent: '#e1251b',
    deep: '#5f1713',
    image: '/images/booths/nestle.svg',
    className: 'left-[778px] top-[224px] h-[122px] w-[270px]',
    variant: 'bottom',
  },
  {
    id: '10',
    name: 'Vinamilk DairyTech Future Zone',
    brand: 'Vinamilk',
    desc: 'Công nghệ sản xuất sữa thông minh thế hệ mới.',
    logo: '/logos/booths/vinamilk.svg',
    accent: '#1655d9',
    deep: '#11356f',
    image: '/images/booths/vinamilk.webp',
    className: 'left-[1072px] top-[224px] h-[122px] w-[270px]',
    variant: 'bottom',
  },
];

function MapUtility() {
  return (
    <div className="expo-map-utility absolute left-[24px] top-[64px] h-[96px] w-[108px]">
      <div className="grid h-11 w-11 place-items-center rounded-[0.35rem] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.16)]">
        <Toilet className="h-6 w-6 text-slate-900" strokeWidth={1.8} />
      </div>
      <span>Khu vệ sinh</span>
    </div>
  );
}

function EntryGate({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`expo-map-gate absolute ${className}`}>
      <div className="grid h-12 w-7 place-items-center rounded-[0.28rem] border border-cyan-200 bg-white">
        <DoorOpen className="h-4 w-4 text-cyan-700" />
      </div>
      <div className="grid h-12 w-7 place-items-center rounded-[0.28rem] border border-cyan-200 bg-white">
        <DoorOpen className="h-4 w-4 text-cyan-700" />
      </div>
      <span>{label}</span>
    </div>
  );
}

function MapRobot({ className = '' }: { className?: string }) {
  return (
    <div className={`expo-map-robot absolute ${className}`}>
      <Bot className="h-5 w-5" />
    </div>
  );
}

function BoothCard({ booth }: { booth: Booth }) {
  const style = {
    '--booth-accent': booth.accent,
    '--booth-deep': booth.deep,
    '--booth-image': `url(${booth.image})`,
  } as CSSProperties;

  const handleExplore = () => {
    const detail: SelectExpoBoothEventDetail = { boothId: booth.id };

    window.dispatchEvent(new CustomEvent(SELECT_EXPO_BOOTH_EVENT, { detail }));
    document.getElementById('cong-nghe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className={`expo-map-booth absolute ${booth.variant === 'bottom' ? 'is-bottom' : 'is-top'} ${booth.className}`} style={style}>
      <span className="expo-map-booth-number">{booth.id}</span>
      <div className="expo-map-booth-logo">
        <img src={booth.logo} alt={`${booth.brand} logo`} />
      </div>
      <div className="expo-map-booth-thumb" />
      <div className="expo-map-booth-copy">
        <h3>{booth.brand}</h3>
        <p className="expo-map-booth-name">{booth.name}</p>
        <p className="expo-map-booth-desc">{booth.desc}</p>
        <button type="button" onClick={handleExplore} aria-label={`Khám phá gian hàng ${booth.brand}`}>
          Khám phá
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}

function MobileBoothCard({ booth }: { booth: Booth }) {
  const handleExplore = () => {
    const detail: SelectExpoBoothEventDetail = { boothId: booth.id };

    window.dispatchEvent(new CustomEvent(SELECT_EXPO_BOOTH_EVENT, { detail }));
    document.getElementById('cong-nghe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article
      className="relative min-h-[270px] w-[82vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.25rem] border border-white/20 bg-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.18)]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.92)), url(${booth.image})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="grid h-11 min-w-24 place-items-center rounded-lg bg-white/94 px-3 shadow-[0_10px_25px_rgba(15,23,42,0.18)]">
          <img src={booth.logo} alt={`${booth.brand} logo`} className="max-h-7 max-w-20 object-contain" />
        </div>
        <span className="font-mono text-sm font-black text-white/80">{booth.id}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">Gian hàng {booth.id}</p>
        <h2 className="mt-2 text-xl font-black leading-tight text-white">{booth.name}</h2>
        <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-white/65">{booth.desc}</p>
        <button
          type="button"
          onClick={handleExplore}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 text-xs font-black text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Khám phá
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

const mapSignals = ['10 gian hàng', 'Live routing'];

export function VirtualExpo() {
  return (
    <section id="trien-lam" className="expo-map-section relative overflow-hidden pb-8 pt-20 sm:pt-24">
      <div className="mx-auto max-w-[1460px] px-3 sm:px-6">
        <div data-reveal className="expo-map-intro mb-2 flex flex-col gap-2 px-1 sm:mb-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">Future Consumer Expo</p>
            <h1 className="mt-1 max-w-3xl text-xl font-black uppercase leading-none tracking-[-0.02em] text-slate-950 sm:text-2xl lg:whitespace-nowrap">
              Sơ đồ tương tác triển lãm 2026
            </h1>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {mapSignals.map((signal) => (
              <span key={signal} className="shrink-0 rounded-[0.55rem] border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                {signal}
              </span>
            ))}
          </div>
        </div>
        <div className="md:hidden">
          <div className="mb-3 flex items-center gap-2 px-1 text-[11px] font-bold text-slate-500">
            <MoveHorizontal className="h-4 w-4 text-blue-600" />
            Vuốt ngang để khám phá 10 gian hàng
          </div>
          <div className="mobile-snap-scroll -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-5">
            {booths.map((booth) => (
              <MobileBoothCard key={booth.id} booth={booth} />
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto border border-slate-200 bg-white p-1 shadow-[0_22px_54px_rgba(15,23,42,0.14)] md:block">
          <div data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties} className="expo-map-canvas relative h-[360px] min-w-[1360px] overflow-hidden">
            <div className="absolute left-4 top-4 z-[3]">
              <h2 className="text-sm font-black uppercase tracking-[0.02em] text-white">Sơ đồ triển lãm</h2>
              <p className="mt-2 text-[10px] font-medium text-slate-400">Click vào gian hàng để khám phá.</p>
            </div>

            <MapUtility />

            {booths.map((booth) => (
              <BoothCard key={booth.id} booth={booth} />
            ))}

            <div className="expo-map-corridor absolute left-0 top-[166px] h-[58px] w-full overflow-hidden">
              <div className="expo-floor-grid absolute inset-0" />
              <EntryGate label="Gate A" className="left-[18px] top-1/2 -translate-y-1/2" />
              <EntryGate label="Gate B" className="right-[24px] top-1/2 -translate-y-1/2" />

              <span className="expo-map-arrow left-[166px]">&rsaquo;&rsaquo;</span>
              <span className="expo-map-arrow left-[254px]">&rsaquo;&rsaquo;</span>
              <span className="expo-map-arrow right-[254px]">&lsaquo;&lsaquo;</span>
              <span className="expo-map-arrow right-[166px]">&lsaquo;&lsaquo;</span>

              <MapRobot className="left-[334px] top-1/2 -translate-y-1/2" />
              <MapRobot className="right-[334px] top-1/2 -translate-y-1/2" />

              <div className="expo-map-lane absolute left-1/2 top-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2">
                <p>Smart Guided Experience Lane</p>
                <span>Hệ thống dẫn đường tự động đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
