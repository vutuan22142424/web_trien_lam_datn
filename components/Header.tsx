'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-white text-xl">FC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base leading-tight tracking-tight text-foreground">
              FUTURE CONSUMER
            </span>
            <span className="font-bold text-sm sm:text-base leading-tight text-blue-600">
              EXPO 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="#trien-lam" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-1 transition-colors">
            TRIỂN LÃM
          </Link>
          <Link href="#cong-nghe" className="text-sm font-semibold text-foreground/70 hover:text-blue-600 transition-colors">
            CÔNG NGHỆ
          </Link>
          <Link href="#lich-trinh" className="text-sm font-semibold text-foreground/70 hover:text-blue-600 transition-colors">
            LỊCH TRÌNH
          </Link>
          <Link href="#tin-tuc" className="text-sm font-semibold text-foreground/70 hover:text-blue-600 transition-colors">
            TIN TỨC
          </Link>
          <Link href="#ve-su-kien" className="text-sm font-semibold text-foreground/70 hover:text-blue-600 transition-colors">
            VỀ SỰ KIỆN
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-foreground">
            <Globe className="w-4 h-4" />
            <span>VI</span>
          </button>
          <Link href="/login">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
            >
              ĐĂNG NHẬP
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background absolute w-full shadow-lg">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            <Link href="#trien-lam" className="text-base font-semibold text-blue-600 transition-colors">
              TRIỂN LÃM
            </Link>
            <Link href="#cong-nghe" className="text-base font-medium text-foreground/80 hover:text-blue-600 transition-colors">
              CÔNG NGHỆ
            </Link>
            <Link href="#lich-trinh" className="text-base font-medium text-foreground/80 hover:text-blue-600 transition-colors">
              LỊCH TRÌNH
            </Link>
            <Link href="#tin-tuc" className="text-base font-medium text-foreground/80 hover:text-blue-600 transition-colors">
              TIN TỨC
            </Link>
            <Link href="#ve-su-kien" className="text-base font-medium text-foreground/80 hover:text-blue-600 transition-colors">
              VỀ SỰ KIỆN
            </Link>
            <div className="pt-4 flex items-center space-x-4 border-t border-border">
               <button className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-foreground">
                <Globe className="w-4 h-4" />
                <span>VI</span>
              </button>
              <Link href="/login" className="flex-1">
                <Button className="w-full bg-blue-600 text-white">
                  ĐĂNG NHẬP
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
