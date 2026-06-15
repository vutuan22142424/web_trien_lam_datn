'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Cpu, Sparkles, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';

export function BrandHighlights() {
  return (
    <section id="cong-nghe" className="py-24 bg-[#0c1220] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10">
          KHÁM PHÁ CÁC GIAN HÀNG NỔI BẬT
        </h2>

        {/* Double bezel card */}
        <div className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/[0.04]">
          <div className="bg-[#111827] rounded-[calc(2rem-0.375rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] flex flex-col lg:flex-row">
            {/* Left image */}
            <div className="w-full lg:w-[45%] h-72 lg:h-auto relative min-h-[340px]">
              <Image
                src="/images/cocacola-booth.png"
                alt="Coca-Cola Experience Hub"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-5 h-1.5 rounded-full bg-blue-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-lg flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ring-1 ring-white/[0.08] active:scale-[0.95]">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-lg flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ring-1 ring-white/[0.08] active:scale-[0.95]">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="w-full lg:w-[55%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl font-bold text-red-500/80 tabular-nums">01</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">Coca-Cola Experience Hub</h3>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[11px] font-medium mt-2 ring-1 ring-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Đang tổ chức sự kiện
                  </span>
                </div>
              </div>

              <p className="text-white/40 text-sm leading-relaxed max-w-[50ch]">
                Khám phá hệ sinh thái đồ uống thông minh với công nghệ AI cá nhân hóa, 
                máy bán hàng tự động và phân tích hành vi người tiêu dùng.
              </p>

              <div>
                <h4 className="text-[10px] font-medium text-white/25 tracking-[0.15em] mb-3">CÔNG NGHỆ NỔI BẬT</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: <Bot className="w-3.5 h-3.5" />, label: 'AI Recommendation' },
                    { icon: <Smartphone className="w-3.5 h-3.5" />, label: 'Smart Dispenser' },
                    { icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Flavor Personalization' },
                    { icon: <Cpu className="w-3.5 h-3.5" />, label: 'Real-time Analytics' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2.5 rounded-lg ring-1 ring-white/[0.04] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer group">
                      <span className="text-blue-400 group-hover:text-blue-300 transition-colors">{t.icon}</span>
                      <span className="font-medium">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white h-10 px-6 rounded-lg text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] group">
                  Xem chi tiết gian hàng <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
                <Button variant="outline" className="bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.04] h-10 px-6 rounded-lg text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
                  Trải nghiệm ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
