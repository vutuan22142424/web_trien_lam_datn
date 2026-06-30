'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface DataPoint {
  ts:      number;
  voltage: number;
  current: number;
  soc?:    number;
}

interface BatteryChartProps {
  compact?: boolean;
   defaultHours?: number;   // ← thêm
}

export function BatteryChart({ compact = false,defaultHours = 1 }: BatteryChartProps) {
  const [data, setData]     = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(defaultHours);

  const fetchHistory = useCallback(async () => {
    try {
      // Để chuyển đổi giữa cơ sở dữ liệu thực tế (robot_01) và giả lập test (robot_test):
      const useTestDb = false; // Đổi thành true nếu muốn dùng api test
      const apiUrl = useTestDb 
        ? `/api/battery/history-test?hours=${hours}`
        : `/api/battery/history?hours=${hours}`;

      const res  = await fetch(apiUrl);
      const json = await res.json();
      if (json.data) {
        // Sắp xếp tăng dần theo thời gian ở phía Client để đảm bảo đồ thị luôn vẽ từ trái sang phải
        const sorted = [...json.data].sort((a, b) => a.ts - b.ts);
        setData(sorted);
      }
    } catch (err) {
      console.error('❌ Lấy lịch sử pin lỗi:', err);
    } finally {
      setLoading(false);
    }
  }, [hours]);


  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  // const ticks = useMemo(() => {
  //   if (data.length < 2) return [];
  //   const minTime = data[0].ts;
  //   const maxTime = data[data.length - 1].ts;

  //   // Chia trục thời gian X thành 6 khoảng đều nhau (tương ứng 7 mốc thời gian hiển thị)
  //   const tickCount = 6;
  //   const interval = (maxTime - minTime) / tickCount;

  //   return Array.from({ length: tickCount + 1 }, (_, i) =>
  //     Math.round(minTime + i * interval)
  //   );
  // }, [data]);

  const ticks = useMemo(() => {
  if (data.length < 2) return [];
  const minTime = data[0].ts;
  const maxTime = data[data.length - 1].ts;

  // Chia trục thời gian X thành 6 khoảng đều nhau (tương ứng 7 mốc thời gian hiển thị)
  const tickCount = 6;
  const interval = (maxTime - minTime) / tickCount;

  return Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round(minTime + i * interval)
  );
}, [data]);

  // Khi xem > 1 giờ thì hiện giờ:phút, không cần giây
  const tickFormatter = (ts: number) =>
    new Date(ts).toLocaleTimeString('vi-VN',
      hours <= 1
        ? { hour: '2-digit', minute: '2-digit', second: '2-digit' }
        : { hour: '2-digit', minute: '2-digit' }
    );

  const chartHeight = compact ? 140 : 220;

  return (
    <div className={cn(!compact && 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm')}>
      {!compact && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
            Điện áp & Dòng điện
          </h2>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
          >
            <option value={0.083}>5 phút</option>
            <option value={0.2}>12 phút</option>
            <option value={0.5}>30 phút</option>
            <option value={1}>1 giờ</option>
            <option value={6}>6 giờ</option>
            <option value={12}>12 giờ</option>
            <option value={24}>24 giờ</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className={cn('flex items-center justify-center text-sm text-slate-400', compact ? 'h-[140px]' : 'h-52')}>
          Đang tải dữ liệu…
        </div>
      ) : data.length === 0 ? (
        <div className={cn('flex items-center justify-center text-sm text-slate-400', compact ? 'h-[140px]' : 'h-52')}>
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="ts"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis
              yAxisId="v"
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fill: '#3b82f6' }}
              unit="V"
            />
            <YAxis
              yAxisId="a"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fill: '#10b981' }}
              unit="A"
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }}
              labelFormatter={tickFormatter}
              formatter={(val: number, name: string) =>
                name === 'Điện áp' ? [`${val} V`, name] : [`${val} A`, name]
              }
            />
            {!compact && <Legend wrapperStyle={{ fontSize: 12 }} />}
            <Line
              yAxisId="v"
              type="monotone"
              dataKey="voltage"
              name="Điện áp"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
            />
            <Line
              yAxisId="a"
              type="monotone"
              dataKey="current"
              name="Dòng điện"
              stroke="#10b981"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}