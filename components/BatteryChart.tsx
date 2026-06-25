'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  time: string;
  voltage: number;
  current: number;
  soc?: number;
}

export function BatteryChart() {
  const [data, setData]       = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints]   = useState(60); // 60 điểm = 5 phút

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/battery/history?points=${points}`);
      const json = await res.json();
      if (json.data) setData(json.data);
    } catch (err) {
      console.error('❌ Lấy lịch sử pin lỗi:', err);
    } finally {
      setLoading(false);
    }
  }, [points]);

  // Lần đầu load + mỗi 30s tự refresh
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
          Điện áp & Dòng điện
        </h2>
        <select
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
        >
          <option value={12}>1 phút</option>
          <option value={60}>5 phút</option>
          <option value={144}>12 phút</option>
          <option value={360}>30 phút</option>
          <option value={720}>1 giờ</option>
        </select>
      </div>

      {loading ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-400">
          Đang tải dữ liệu…
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-400">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval="preserveStartEnd"
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
              formatter={(val: number, name: string) =>
                name === 'Điện áp' ? [`${val} V`, name] : [`${val} A`, name]
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
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