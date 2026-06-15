'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Users, Store, TrendingUp, Play, BookOpen } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ran.current) {
          ran.current = true;
          let t0 = 0;
          const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 1800, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center bg-[#070b14] overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        {/* Gradient orbs */}
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full py-24">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left - content */}
          <div className="w-full lg:w-[58%] space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
              FUTURE CONSUMER{' '}
              <span className="text-blue-400">EXPO 2026</span>
            </h1>

            <p className="text-lg text-blue-300/70 font-medium">
              Where Technology Meets Consumer Experience
            </p>

            <p className="text-base text-white/45 max-w-[520px] leading-relaxed">
              Khám phá không gian triển lãm ảo với các thương hiệu hàng đầu 
              và công nghệ tương lai trong lĩnh vực tiêu dùng.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-7 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-[0_0_24px_rgba(59,130,246,0.2)]">
                <Play className="mr-2 w-4 h-4" /> BẮT ĐẦU THAM QUAN
              </Button>
              <Button variant="outline" className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.04] h-12 px-7 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
                <BookOpen className="mr-2 w-4 h-4" /> HƯỚNG DẪN THAM QUAN
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-white/[0.06]">
              {[
                { Icon: Users, value: 143, label: 'Visitors Online', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { Icon: Store, value: 8, label: 'Gian hàng', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { Icon: TrendingUp, value: 92, label: 'Tương tác', suffix: '%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white tabular-nums">
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-white/35">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - robot */}
          <div className="w-full lg:w-[42%] flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Soft glow behind */}
              <div className="absolute inset-[-20%] bg-blue-500/8 rounded-full blur-[60px]" />
              <Image
                src="/images/robot-guide.png"
                alt="Robot Guide"
                fill
                className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c1220] to-transparent" />
    </section>
  );
}
