'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate credentials (admin/123)
    if (username === 'admin' && password === '123') {
      // Set auth cookie
      document.cookie = 'auth_token=admin_token_valid; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f3f7fb] p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.10),transparent_26%)]" />
      <Card className="relative w-full max-w-md rounded-[1.5rem] border-slate-200 bg-white/95 shadow-[0_28px_90px_rgba(30,64,175,0.14)] backdrop-blur">
        <CardHeader className="space-y-2 px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.22)]">
              <LockKeyhole className="h-5 w-5" />
            </div>
          </div>
          <CardTitle className="text-balance text-center text-2xl font-black tracking-[-0.03em]">Đăng nhập quản trị</CardTitle>
          <CardDescription className="text-center text-sm">
            Truy cập bảng điều khiển quản lý
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-foreground">
                Tên Đăng Nhập
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="border-border"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Mật Khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-border"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full border-0 bg-blue-600 font-bold text-white hover:bg-blue-700"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-foreground/60 text-center mb-3">Thông Tin Demo:</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p><strong>Tên Đăng Nhập:</strong> admin</p>
                <p><strong>Mật Khẩu:</strong> 123</p>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900">
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
