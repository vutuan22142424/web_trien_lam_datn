'use client';

import { useMemo, useState } from 'react';
import {
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Home,
  MoveHorizontal,
  Navigation,
  Pause,
  Play,
  Power,
  Signal,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandHistoryTable } from '@/components/CommandHistoryTable'; // ← THÊM
import { RobotLiveMap } from '@/components/RobotLiveMap';
type MqttCommand = {
  id: string;
  timestamp: string;
  operator: string;
  topic: string;
  command: string;
  payload: string;
  feedbackTopic: string;
  status: string;
  qos: number;
  latencyMs: number;
};

type QuickRobotAction = {
  id: string;
  label: string;
  topic: string;
  command: string;
  payload: string;
  feedbackTopic: string;
  qos: number;
  tone: string;
};

type RobotData = {
  name: string;
  poseRaw?: { x: number; y: number; yaw: number } | null;   // ← THÊM
  position: {
    zone: string;
    x: number;
    y: number;
    heading: number;
  };
  telemetry: {
    battery: {
      soc: number;
      voltage: number;
      current: number;
      charging_state: string;
      charging: boolean;
    };
    state: {
      state: string;
    };
  };
  mqtt: {
    broker: string;
    clientId: string;
    connection: string;
    lastSync: string;
    quickActions: QuickRobotAction[];
    commands: MqttCommand[];
  };
};

interface ExhibitionTabProps {
  robot: RobotData;
  publishCommand: (topic: string, payload: any) => void;
}

const statusMeta: Record<string, { label: string; className: string; icon: LucideIcon }> = {
  ACCEPTED: {
    label: 'ACCEPTED',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  EXECUTING: {
    label: 'EXECUTING',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Signal,
  },
  PAUSED: {
    label: 'PAUSED',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Clock3,
  },
  CANCELED: {
    label: 'CANCELED',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
    icon: XCircle,
  },
  REJECTED: {
    label: 'REJECTED',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: XCircle,
  },
  FAILED: {
    label: 'FAILED',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: XCircle,
  },
};

const mapZones = [
  { name: 'Coca-Cola', className: 'left-[10%] top-[12%] h-[19%] w-[12%]', tone: 'border-red-200 bg-red-100 text-red-700' },
  { name: 'Pepsi', className: 'left-[23.5%] top-[12%] h-[19%] w-[12%]', tone: 'border-blue-200 bg-blue-100 text-blue-700' },
  { name: 'Red Bull', className: 'left-[37%] top-[12%] h-[19%] w-[12%]', tone: 'border-yellow-200 bg-yellow-100 text-yellow-800' },
  { name: 'Heineken', className: 'left-[50.5%] top-[12%] h-[19%] w-[12%]', tone: 'border-emerald-200 bg-emerald-100 text-emerald-700' },
  { name: 'Tiger', className: 'left-[64%] top-[12%] h-[19%] w-[12%]', tone: 'border-amber-200 bg-amber-100 text-amber-700' },
  { name: 'Sabeco', className: 'left-[77.5%] top-[12%] h-[19%] w-[12%]', tone: 'border-orange-200 bg-orange-100 text-orange-700' },
  { name: 'Abbott', className: 'left-[16%] bottom-[12%] h-[18%] w-[16%]', tone: 'border-cyan-200 bg-cyan-100 text-cyan-700' },
  { name: 'Nutifood', className: 'left-[36.5%] bottom-[12%] h-[18%] w-[16%]', tone: 'border-green-200 bg-green-100 text-green-700' },
  { name: 'Nestlé', className: 'left-[57%] bottom-[12%] h-[18%] w-[16%]', tone: 'border-rose-200 bg-rose-100 text-rose-700' },
  { name: 'Vinamilk', className: 'left-[77.5%] bottom-[12%] h-[18%] w-[16%]', tone: 'border-indigo-200 bg-indigo-100 text-indigo-700' },
];

function ShellPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'min-w-0 overflow-hidden rounded-[1.45rem] border border-slate-200/90 bg-white shadow-[0_20px_56px_rgba(15,23,42,0.07)]',
        className,
      )}
    >
      {children}
    </section>
  );
}



function RobotMapSection({ robot }: { robot: RobotData }) {
  return (
    <ShellPanel>
      <div className="p-5 sm:p-7">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Live floor map</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">Bản đồ vị trí robot</h2>

        <div className="mt-5 h-[400px]">
          <RobotLiveMap pose={robot.poseRaw ?? null} />
        </div>
      </div>
    </ShellPanel>
  );
}
function BatteryPanel({ battery }: { battery: RobotData['telemetry']['battery'] }) {
  const soc = Math.max(0, Math.min(100, Math.round(battery.soc)));
  const isLow = soc <= 20;
  const isWarning = soc > 20 && soc <= 45;
  const statusLabel = battery.charging ? 'Đang sạc' : isLow ? 'Cần sạc' : isWarning ? 'Theo dõi' : 'Ổn định';
  const fillClass = battery.charging
    ? 'from-sky-500 via-blue-500 to-cyan-400'
    : isLow
      ? 'from-rose-500 via-red-500 to-orange-400'
      : isWarning
        ? 'from-amber-500 via-yellow-500 to-orange-400'
        : 'from-emerald-500 via-teal-500 to-blue-500';

  return (
    <ShellPanel className="h-full">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-slate-400">Battery SoC</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-mono text-4xl font-black leading-none tabular-nums text-emerald-600">{soc}%</span>
              <span className="mb-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                {statusLabel}
              </span>
            </div>
          </div>
          <BatteryCharging className="h-6 w-6 text-emerald-600" strokeWidth={1.9} />
        </div>

        <div className="mt-5 flex items-center gap-2" aria-label={`Pin robot ${soc}%`}>
          <div className="relative h-14 flex-1 rounded-[1rem] border border-slate-300 bg-slate-100 p-1 shadow-[inset_0_2px_8px_rgba(15,23,42,0.10)]">
            <div className="absolute inset-1 overflow-hidden rounded-[0.75rem] bg-white">
              <div className={cn('h-full rounded-[0.75rem] bg-gradient-to-r', fillClass)} style={{ width: `${soc}%` }} />
            </div>
          </div>
          <div className="h-8 w-2 rounded-r-[0.45rem] border border-l-0 border-slate-300 bg-slate-200" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-[0.8rem] bg-slate-50 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Voltage</p>
            <p className="mt-1 font-mono font-black text-slate-950">{battery.voltage}V</p>
          </div>
          <div className="rounded-[0.8rem] bg-slate-50 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Current</p>
            <p className="mt-1 font-mono font-black text-slate-950">{battery.current}A</p>
          </div>
          <div className="rounded-[0.8rem] bg-slate-50 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">State</p>
            <p className="mt-1 truncate font-mono font-black text-slate-950">{battery.charging_state}</p>
          </div>
        </div>
      </div>
    </ShellPanel>
  );
}

function EmergencyControls({ robot, publishCommand }: { robot: RobotData; publishCommand: (topic: string, payload: any) => void }) {
  const [isPaused, setIsPaused] = useState(robot.telemetry.state.state === 'PAUSED');
  const [activeAction, setActiveAction] = useState<string | null>(null);

const handleStop = () => {
    const ok = confirm('⚠️ Xác nhận DỪNG robot?');
    if (!ok) return;
    publishCommand('robot/powerswitch/cmd', 'off');
    setActiveAction('power-off');
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      publishCommand('robot/cmd/resume', {});
    } else {
      publishCommand('robot/cmd/pause', {});
    }
    setIsPaused((current) => !current);
    setActiveAction(isPaused ? 'resume' : 'pause');
  };
    const handleDock = () => {
    publishCommand('robot/cmd/gotodock', {});
    setActiveAction('gotodock');
  };
  return (
    <ShellPanel className="h-full">
      <div className="flex h-full min-h-[270px] flex-col justify-center gap-3 p-5 sm:p-6">
        <button
          type="button"
           onClick={handleStop}
          className={cn(
            'group flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === 'power-off'
              ? 'border-rose-600 bg-rose-600 text-white shadow-[0_14px_28px_rgba(225,29,72,0.22)]'
              : 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100',
          )}
        >
          <Power className="h-5 w-5" strokeWidth={2} />
          Tắt nguồn Robot
        </button>

        <button
          type="button"
          onClick={handlePauseToggle}
          className={cn(
            'flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === (isPaused ? 'pause' : 'resume')
              ? 'border-amber-500 bg-amber-500 text-white shadow-[0_14px_28px_rgba(245,158,11,0.20)]'
              : 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100',
          )}
        >
          {isPaused ? <Play className="h-5 w-5" strokeWidth={2} /> : <Pause className="h-5 w-5" strokeWidth={2} />}
          {isPaused ? 'Tiếp tục hoạt động' : 'Tạm dừng hoạt động'}
        </button>

        <button
          type="button"
          onClick={handleDock}
          className={cn(
            'flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === ( 'gotodock')
              ? 'border-blue-600 bg-blue-600 text-white shadow-[0_14px_28px_rgba(37,99,235,0.20)]'
              : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100',
          )}
        >
          <Home className="h-5 w-5" strokeWidth={2} />
          Quay về trạm sạc
        </button>
      </div>
    </ShellPanel>
  );
}


export function ExhibitionTab({ robot, publishCommand }: ExhibitionTabProps) {
  return (
    <div className="space-y-6">
      <RobotMapSection robot={robot} />

      <section aria-label="Pin và điều khiển robot" className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <BatteryPanel battery={robot.telemetry.battery} />
        <EmergencyControls robot={robot} publishCommand={publishCommand} />
      </section>

      <section className="rounded-[1.45rem] border border-slate-200/90 bg-white p-5 shadow-[0_20px_56px_rgba(15,23,42,0.07)] sm:p-7">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">MQTT command stream</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">Lịch sử lệnh gửi tới robot</h2>
        <div className="mt-5">
          <CommandHistoryTable />
        </div>
      </section>
    </div>
  );
}
