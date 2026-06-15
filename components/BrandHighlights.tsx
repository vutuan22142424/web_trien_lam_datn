'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Cpu, Sparkles, Smartphone } from 'lucide-react';

export function BrandHighlights() {
  return (
    <section id="cong-nghe" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 uppercase tracking-wide">
          KHÁM PHÁ CÁC GIAN HÀNG NỔI BẬT
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 items-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          {/* Left Image */}
          <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 relative">
            <Image
              src="/images/exhibition.jpg"
              alt="Coca-Cola Experience Hub"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                <div className="w-6 h-2 rounded-full bg-blue-500" />
                <div className="w-2 h-2 rounded-full bg-white opacity-50" />
              </div>
            </div>
            {/* Nav buttons */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-red-600">01</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Coca-Cola Experience Hub</h3>
                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-semibold mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Đang tổ chức sự kiện
                </span>
              </div>
            </div>
            
            <p className="text-slate-600 text-base sm:text-lg">
              Khám phá hệ sinh thái đồ uống thông minh với công nghệ AI cá nhân hóa, 
              máy bán hàng tự động và phân tích hành vi người tiêu dùng.
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">CÔNG NGHỆ NỔI BẬT</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                  <Bot className="w-4 h-4 text-blue-500" /> AI Recommendation
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                  <Smartphone className="w-4 h-4 text-blue-500" /> Smart Dispenser
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                  <Sparkles className="w-4 h-4 text-blue-500" /> Flavor Personalization
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                  <Cpu className="w-4 h-4 text-blue-500" /> Real-time Analytics
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button className="bg-[#1e293b] hover:bg-slate-800 text-white px-6 py-5 rounded-md text-sm font-semibold transition-all">
                Xem chi tiết gian hàng <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-5 rounded-md text-sm font-semibold transition-all">
                Trải nghiệm ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronLeftIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}
