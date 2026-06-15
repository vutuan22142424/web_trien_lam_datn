'use client';

import { ArrowRight, Bot, DoorOpen, Toilet } from 'lucide-react';
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
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coca-cola.com&size=128',
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
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://pepsi.com&size=128',
    accent: '#1357c8',
    deep: '#082345',
    image: '/images/booths/pepsi.webp',
    className: 'left-[352px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '03',
    name: 'Heineken Future Brewing',
    brand: 'Heineken',
    desc: 'Công nghệ ủ bia bền vững và thông minh.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://heineken.com&size=128',
    accent: '#0b8c45',
    deep: '#05321e',
    image: '/images/booths/heineken.webp',
    className: 'left-[554px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '04',
    name: 'Tiger Smart Distribution',
    brand: 'Tiger',
    desc: 'Logistics thông minh, tối ưu chuỗi cung ứng.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tigerbeer.com&size=128',
    accent: '#d88211',
    deep: '#092b54',
    image: '/images/booths/tiger.webp',
    className: 'left-[756px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '05',
    name: 'Sabeco Industry Pavilion',
    brand: 'Sabeco',
    desc: 'Đổi mới ngành đồ uống Việt Nam với công nghệ.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sabeco.com.vn&size=128',
    accent: '#b88405',
    deep: '#102139',
    image: '/images/booths/sabeco.webp',
    className: 'left-[958px] top-[12px] h-[146px] w-[194px]',
    variant: 'top',
  },
  {
    id: '06',
    name: 'Abbott Healthcare Innovation',
    brand: 'Abbott',
    desc: 'Giải pháp chăm sóc sức khỏe tiên tiến.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://abbott.com&size=128',
    accent: '#159bd3',
    deep: '#075985',
    image: '/images/booths/abbott.webp',
    className: 'left-[244px] top-[224px] h-[122px] w-[220px]',
    variant: 'bottom',
  },
  {
    id: '07',
    name: 'Nutifood Nutrition Tech Lab',
    brand: 'Nutifood',
    desc: 'Dinh dưỡng cá nhân hóa dựa trên dữ liệu sức khỏe.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://nutifood.com.vn&size=128',
    accent: '#0c9b61',
    deep: '#065f46',
    image: '/images/booths/nutifood.webp',
    className: 'left-[480px] top-[224px] h-[122px] w-[220px]',
    variant: 'bottom',
  },
  {
    id: '08',
    name: 'Vinamilk DairyTech Future Zone',
    brand: 'Vinamilk',
    desc: 'Công nghệ sản xuất sữa thông minh thế hệ mới.',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://vinamilk.com.vn&size=128',
    accent: '#1655d9',
    deep: '#11356f',
    image: '/images/booths/vinamilk.webp',
    className: 'left-[716px] top-[224px] h-[122px] w-[220px]',
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
        <button>
          Khám phá
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}

export function VirtualExpo() {
  return (
    <section id="trien-lam" className="expo-map-section relative overflow-hidden pb-8 pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6">
        <div className="overflow-x-auto border border-slate-200 bg-white p-1 shadow-[0_22px_54px_rgba(15,23,42,0.14)]">
          <div data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties} className="expo-map-canvas relative h-[360px] min-w-[1180px] overflow-hidden">
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

            <div className="expo-map-plant absolute left-[132px] top-[232px]" />
            <div className="expo-map-plant absolute right-[44px] top-[236px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
