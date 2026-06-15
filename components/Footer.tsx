'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1e293b] pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-white text-xl">FC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight tracking-tight text-white">
                  FUTURE CONSUMER
                </span>
                <span className="font-bold text-sm leading-tight text-blue-500">
                  EXPO 2026
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mt-4 max-w-xs">
              Sự kiện triển lãm trực tuyến hàng đầu về công nghệ và trải nghiệm tiêu dùng tương lai.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">VỀ SỰ KIỆN</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Giới thiệu</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Ban tổ chức</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Đối tác</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">THÔNG TIN</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Hướng dẫn tham quan</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">THEO DÕI CHÚNG TÔI</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">ĐĂNG KÝ NHẬN TIN</h4>
              <div className="flex gap-2">
                <Input type="email" placeholder="Nhập email của bạn" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Đăng ký</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; 2026 Future Consumer Expo. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Điều khoản sử dụng</Link>
            <Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
