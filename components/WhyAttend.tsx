'use client';

import { Lightbulb, Handshake, Users, PlaySquare } from 'lucide-react';

const benefits = [
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
    title: 'Công nghệ tiên tiến',
    desc: 'Trải nghiệm các công nghệ mới nhất trong ngành hàng tiêu dùng.',
  },
  {
    icon: <Handshake className="w-8 h-8 text-blue-500" />,
    title: 'Tương tác trực tiếp',
    desc: 'Tham gia các demo interactive và hoạt động hướng dẫn từ AI.',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: 'Kết nối doanh nghiệp',
    desc: 'Gặp gỡ và kết nối với các chuyên gia và thương hiệu hàng đầu.',
  },
  {
    icon: <PlaySquare className="w-8 h-8 text-blue-500" />,
    title: 'Trải nghiệm đa sống động',
    desc: 'Tham quan không gian ảo chân thực với hướng dẫn tự động.',
  },
];

export function WhyAttend() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center uppercase tracking-wide">
          VÌ SAO NÊN THAM GIA?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 space-y-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-slate-600 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
