'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin, Mail, Send, Twitter } from 'lucide-react';

const footerLinks = {
  'Về sự kiện': ['Giới thiệu', 'Ban tổ chức', 'Đối tác', 'Liên hệ'],
  'Thông tin': ['Hướng dẫn tham quan', 'Câu hỏi thường gặp', 'Hỗ trợ kỹ thuật', 'Chính sách bảo mật'],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#edf5ff] pb-8 pt-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-14 rounded-[1.35rem] bg-blue-600 p-7 text-white shadow-[0_24px_80px_rgba(37,99,235,0.24)] sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-[-0.02em]">Sẵn sàng tham quan?</h3>
              <p className="mt-2 text-sm font-medium text-blue-100">Đăng ký ngay để không bỏ lỡ sự kiện nổi bật năm 2026.</p>
            </div>
            <Button className="h-11 w-full rounded-[0.85rem] bg-white px-6 text-sm font-black text-blue-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-blue-50 active:scale-[0.98] sm:w-auto">
              Đăng ký miễn phí
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-slate-200 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_0.75fr_1.2fr]">
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex">
              <img src="/logos/fce-logo.svg" alt="Future Consumer Expo 2026" className="h-12 w-[214px] object-contain object-left" />
            </Link>
            <p className="max-w-sm text-sm font-medium leading-7 text-slate-500">
              Sự kiện triển lãm trực tuyến hàng đầu về công nghệ và trải nghiệm tiêu dùng tương lai.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</h4>
              <ul className="space-y-3">
                {links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm font-semibold text-slate-500 transition-colors duration-300 hover:text-blue-700">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 space-y-6 md:col-span-1">
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Theo dõi chúng tôi</h4>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-[0.75rem] border border-slate-200 bg-white text-slate-500 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.95]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                Đăng ký nhận tin
              </h4>
              <div className="flex min-w-0 gap-2">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="h-10 min-w-0 rounded-[0.75rem] border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-100"
                />
                <Button className="h-10 rounded-[0.75rem] bg-blue-600 px-3 text-white transition-all duration-300 hover:bg-blue-700 active:scale-[0.95]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 md:flex-row">
          <p className="text-[11px] font-medium text-slate-400">&copy; 2026 Future Consumer Expo. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="#" className="text-[11px] font-semibold text-slate-400 transition-colors duration-300 hover:text-blue-700">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-[11px] font-semibold text-slate-400 transition-colors duration-300 hover:text-blue-700">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
