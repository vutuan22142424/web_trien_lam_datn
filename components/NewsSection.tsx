'use client';

import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';

const news = [
  {
    image: '/images/exhibition-hall.png',
    date: '10/06/2026',
    category: 'Tin tức',
    title: 'Future Consumer Expo 2026 thu hút hơn 50.000 lượt đăng ký tham quan',
    excerpt: 'Sự kiện triển lãm ảo đầu tiên về ngành hàng tiêu dùng tại Việt Nam đã vượt mốc 50.000 lượt đăng ký.',
  },      
  {
    image: '/images/cocacola-booth.png',
    date: '08/06/2026',
    category: 'Công nghệ',
    title: 'Robot dẫn đường AI: bước đột phá trong trải nghiệm triển lãm ảo',
    excerpt: 'Hệ thống robot NOVA-X1 tích hợp AI đang thay đổi cách khách tham quan tương tác với gian hàng.',
  },
  {
    image: '/images/robot-guide.png',
    date: '05/06/2026',
    category: 'Đối tác',
    title: 'Coca-Cola và Pepsi đồng loạt ra mắt gian hàng công nghệ mới',
    excerpt: 'Hai thương hiệu giải khát giới thiệu gian hàng trải nghiệm công nghệ AI cá nhân hóa.',
  },
];

export function NewsSection() {
  return (
    <section id="tin-tuc" className="expo-section-light relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div data-reveal className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Tin tức và cập nhật
          </h2>
          <button className="hidden items-center gap-1.5 text-xs font-black text-blue-700 transition-colors duration-300 hover:text-blue-900 sm:flex">
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div data-reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article key={item.title} className="motion-card group overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] hover:border-blue-200">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]">

                  </span>
                </div>
              </div>
              <div className="flex min-h-[180px] flex-col p-5">
                <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-950 transition-colors duration-300 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm font-medium leading-6 text-slate-500">
                  {item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
