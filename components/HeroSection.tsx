'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Users, Store, TrendingUp, Info } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="w-full lg:w-3/5 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              FUTURE CONSUMER <span className="text-blue-600">EXPO 2026</span>
            </h1>
            <h2 className="text-xl sm:text-2xl text-blue-600 font-semibold">
              Where Technology Meets Consumer Experience
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              Khám phá không gian triển lãm ảo với các thương hiệu hàng đầu và công nghệ tương lai trong lĩnh vực tiêu dùng.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md text-base font-semibold transition-all">
                BẮT ĐẦU THAM QUAN <Info className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-md text-base font-semibold transition-all">
                HƯỚNG DẪN THAM QUAN
              </Button>
            </div>
          </div>

          {/* Right stats and robot */}
          <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-end space-y-8">
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 sm:gap-10 w-full">
              {/* Stat 1 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-blue-500 mb-1">
                  <Users className="w-6 h-6" />
                  <span className="text-3xl font-bold text-slate-800">143</span>
                </div>
                <span className="text-sm font-medium text-slate-500">Visitors Online</span>
              </div>
              
              {/* Stat 2 */}
              <div className="flex flex-col items-center border-l border-slate-200 pl-6 sm:pl-10">
                <div className="flex items-center space-x-2 text-blue-500 mb-1">
                  <Store className="w-6 h-6" />
                  <span className="text-3xl font-bold text-slate-800">8</span>
                </div>
                <span className="text-sm font-medium text-slate-500">Gian hàng</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center border-l border-slate-200 pl-6 sm:pl-10">
                <div className="flex items-center space-x-2 text-blue-500 mb-1">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-3xl font-bold text-slate-800">92%</span>
                </div>
                <span className="text-sm font-medium text-slate-500">Tương tác</span>
              </div>
            </div>

            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mt-4 floating-animation">
              <Image
                src="/images/robot.jpg"
                alt="Robot Guide"
                fill
                className="object-contain rounded-full shadow-lg border-4 border-white"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
