'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Activity, User } from 'lucide-react';

const booths = [
  { id: '01', name: 'Coca-Cola Experience Hub', brand: 'Coca-Cola', desc: 'Trải nghiệm cá nhân hóa đồ uống bằng AI.', color: 'bg-red-700' },
  { id: '02', name: 'Pepsi Interactive Lab', brand: 'PEPSI', desc: 'Tương tác thông minh, kết nối khách hàng.', color: 'bg-blue-800' },
  { id: '03', name: 'Heineken Future Brewing', brand: 'Heineken', desc: 'Công nghệ ủ bia thông minh.', color: 'bg-green-800' },
  { id: '04', name: 'Tiger Smart Distribution', brand: 'Tiger', desc: 'Logistics thông minh, tối ưu chuỗi cung ứng.', color: 'bg-blue-900' },
  { id: '05', name: 'Sabeco Industry Pavilion', brand: 'SABECO', desc: 'Đổi mới ngành đồ uống Việt Nam.', color: 'bg-yellow-600' },
  { id: '06', name: 'Abbott Healthcare', brand: 'Abbott', desc: 'Giải pháp chăm sóc sức khỏe tiên tiến.', color: 'bg-sky-600' },
  { id: '07', name: 'Nutifood Nutrition Lab', brand: 'Nutifood', desc: 'Dinh dưỡng cá nhân hóa dựa trên dữ liệu.', color: 'bg-emerald-600' },
  { id: '08', name: 'Vinamilk Future Zone', brand: 'Vinamilk', desc: 'Công nghệ sản xuất sữa thông minh thế hệ mới.', color: 'bg-blue-600' },
];

export function VirtualExpo() {
  return (
    <section id="trien-lam" className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="bg-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" /> SƠ ĐỒ TRIỂN LÃM
              </h2>
              <p className="text-slate-400 text-sm mt-1">Click vào gian hàng để khám phá</p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            
            {/* Left: Expo Map Area */}
            <div className="flex-1 space-y-6">
              {/* Row 1 Booths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/10 rounded-xl p-4 flex items-center justify-center border border-white/5">
                  <div className="text-center">
                    <User className="w-8 h-8 text-white/50 mx-auto mb-2" />
                    <span className="text-white/70 text-sm font-medium">Khu vực chờ</span>
                  </div>
                </div>
                {booths.slice(0, 4).map((booth) => (
                  <div key={booth.id} className={`${booth.color} rounded-xl p-4 relative group cursor-pointer border border-white/10 hover:scale-105 transition-transform duration-300 shadow-lg`}>
                    <div className="absolute top-2 right-3 text-white/50 font-mono text-sm">{booth.id}</div>
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center font-bold text-xs text-slate-800 mb-3 shadow-inner">
                      {booth.brand}
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{booth.name}</h3>
                    <p className="text-white/80 text-xs line-clamp-2 mb-4">{booth.desc}</p>
                    <button className="text-white text-xs font-semibold flex items-center gap-1 group-hover:text-blue-200 transition-colors">
                      Khám phá <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Smart Guided Lane */}
              <div className="bg-slate-800/80 rounded-full py-3 px-6 flex items-center justify-between border border-blue-500/30 relative">
                <div className="absolute left-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
                  <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-[shimmer_3s_infinite]" />
                </div>
                <div className="flex gap-2 text-blue-400">
                  <ChevronLeft className="w-4 h-4 opacity-50" />
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-4 z-10">
                  <span className="text-2xl">🤖</span>
                  <div className="bg-blue-600/20 px-6 py-1.5 rounded-full border border-blue-500/50">
                    <span className="text-blue-300 font-semibold text-sm tracking-wider">SMART GUIDED EXPERIENCE LANE</span>
                  </div>
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="flex gap-2 text-blue-400">
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </div>

              {/* Row 2 Booths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-12">
                {booths.slice(4, 8).map((booth) => (
                  <div key={booth.id} className={`${booth.color} rounded-xl p-4 relative group cursor-pointer border border-white/10 hover:scale-105 transition-transform duration-300 shadow-lg`}>
                    <div className="absolute top-2 right-3 text-white/50 font-mono text-sm">{booth.id}</div>
                    <div className="h-10 w-auto bg-white rounded flex items-center justify-center font-bold text-xs text-slate-800 mb-3 px-2 shadow-inner inline-block">
                      {booth.brand}
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{booth.name}</h3>
                    <p className="text-white/80 text-xs line-clamp-2 mb-4">{booth.desc}</p>
                    <button className="text-white text-xs font-semibold flex items-center gap-1 group-hover:text-blue-200 transition-colors">
                      Khám phá <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info Panels */}
            <div className="w-full xl:w-72 space-y-4">
              {/* Live Stats */}
              <div className="bg-slate-800/80 rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" /> THỐNG KÊ TRỰC TIẾP
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Visitors Online</span>
                    <span className="text-white font-mono font-bold">143</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Lượt tham quan</span>
                    <span className="text-white font-mono font-bold">2,458</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Tương tác hôm nay</span>
                    <span className="text-white font-mono font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Robot Guide</span>
                    <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-0.5 rounded">2 Đang hoạt động</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/80 rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">HOẠT ĐỘNG GẦN ĐÂY</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-600 before:to-transparent">
                  {[
                    { user: 'Visitor_1087', action: 'vừa ghé thăm gian Coca-Cola', time: '2 phút trước' },
                    { user: 'Visitor_0942', action: 'đang xem mô hình ủ bia', time: '5 phút trước' },
                    { user: 'Visitor_2011', action: 'tương tác với Robot Guide', time: '8 phút trước' },
                  ].map((activity, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10" />
                        <div>
                          <p className="text-white text-xs font-semibold">{activity.user}</p>
                          <p className="text-slate-400 text-[10px]">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-slate-500 text-[10px] ml-auto">{activity.time}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs">
                  XEM TẤT CẢ HOẠT ĐỘNG
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
