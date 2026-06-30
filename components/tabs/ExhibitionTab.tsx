'use client';

import { useState } from 'react';
import {
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Home,
  Maximize2,
  Pause,
  Play,
  Power,
  Signal,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandHistoryTable } from '@/components/CommandHistoryTable';
import { RobotLiveMap } from '@/components/RobotLiveMap';
import { BatteryChart } from '@/components/BatteryChart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ── Types ──────────────────────────────────────────────────────────────────

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
  poseRaw?: { x: number; y: number; yaw: number } | null;
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

// ── Constants ──────────────────────────────────────────────────────────────

const statusMeta: Record<string, { label: string; className: string; icon: LucideIcon }> = {
  ACCEPTED: { label: 'ACCEPTED', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  EXECUTING: { label: 'EXECUTING', className: 'border-sky-200 bg-sky-50 text-sky-700', icon: Signal },
  PAUSED:    { label: 'PAUSED',    className: 'border-amber-200 bg-amber-50 text-amber-700',   icon: Clock3 },
  CANCELED:  { label: 'CANCELED',  className: 'border-slate-200 bg-slate-100 text-slate-700',  icon: XCircle },
  REJECTED:  { label: 'REJECTED',  className: 'border-rose-200 bg-rose-50 text-rose-700',      icon: XCircle },
  FAILED:    { label: 'FAILED',    className: 'border-rose-200 bg-rose-50 text-rose-700',      icon: XCircle },
};

// ── ShellPanel ─────────────────────────────────────────────────────────────

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

// ── BatteryChartPanel ──────────────────────────────────────────────────────

function BatteryChartPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShellPanel className="h-full">
        <div className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-slate-400">
                Điện áp & Dòng điện
              </p>
              <p className="mt-1 text-sm font-black text-slate-950">Real-time telemetry</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 transition hover:bg-blue-100"
            >
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} />
              Phóng to
            </button>
          </div>

          <div className="mt-4 flex-1">
            <BatteryChart compact defaultHours={0.083}/>
          </div>
        </div>
      </ShellPanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black tracking-tight text-slate-950">
              Điện áp & Dòng điện — Chi tiết
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <BatteryChart />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── RobotMapSection ────────────────────────────────────────────────────────

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

// ── BatteryPanel ───────────────────────────────────────────────────────────

function BatteryPanel({ battery }: { battery: RobotData['telemetry']['battery'] }) {
  const soc = Math.max(0, Math.min(100, Math.round(battery.soc)));
  const isLow     = soc <= 20;
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

// ── EmergencyControls ──────────────────────────────────────────────────────

function EmergencyControls({
  robot,
  publishCommand,
}: {
  robot: RobotData;
  publishCommand: (topic: string, payload: any) => void;
}) {
  const [isPaused, setIsPaused]     = useState(robot.telemetry.state.state === 'PAUSED');
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
    setIsPaused((c) => !c);
    setActiveAction(isPaused ? 'resume' : 'pause');
  };

  const handleDock = () => {
    publishCommand('robot/cmd/gotodock', {});
    setActiveAction('gotodock');
  };

  return (
    <ShellPanel>
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.17em] text-slate-400">
          Điều khiển khẩn cấp
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleStop}
            className={cn(
              'flex min-h-14 items-center justify-center gap-2.5 rounded-[1rem] border px-4 text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 active:scale-[0.99]',
              activeAction === 'power-off'
                ? 'border-rose-600 bg-rose-600 text-white shadow-[0_14px_28px_rgba(225,29,72,0.22)]'
                : 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100',
            )}
          >
            <Power className="h-4 w-4" strokeWidth={2} />
            Tắt nguồn robot
          </button>

          <button
            type="button"
            onClick={handlePauseToggle}
            className={cn(
              'flex min-h-14 items-center justify-center gap-2.5 rounded-[1rem] border px-4 text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.99]',
              activeAction === (isPaused ? 'pause' : 'resume')
                ? 'border-amber-500 bg-amber-500 text-white shadow-[0_14px_28px_rgba(245,158,11,0.20)]'
                : 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100',
            )}
          >
            {isPaused
              ? <Play className="h-4 w-4" strokeWidth={2} />
              : <Pause className="h-4 w-4" strokeWidth={2} />}
            {isPaused ? 'Tiếp tục hoạt động' : 'Tạm dừng hoạt động'}
          </button>

          <button
            type="button"
            onClick={handleDock}
            className={cn(
              'flex min-h-14 items-center justify-center gap-2.5 rounded-[1rem] border px-4 text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.99]',
              activeAction === 'gotodock'
                ? 'border-blue-600 bg-blue-600 text-white shadow-[0_14px_28px_rgba(37,99,235,0.20)]'
                : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100',
            )}
          >
            <Home className="h-4 w-4" strokeWidth={2} />
            Quay về trạm sạc
          </button>
        </div>
      </div>
    </ShellPanel>
  );
}

// ── ExhibitionTab ──────────────────────────────────────────────────────────

export function ExhibitionTab({ robot, publishCommand }: ExhibitionTabProps) {
  return (
    <div className="space-y-6">
      {/* Hàng 1: Bản đồ */}
      <RobotMapSection robot={robot} />

      {/* Hàng 2: Pin + BatteryChart */}
      <section
        aria-label="Pin và biểu đồ telemetry"
        className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <BatteryPanel battery={robot.telemetry.battery} />
        <BatteryChartPanel />
      </section>

      {/* Hàng 3: 3 nút điều khiển */}
      <EmergencyControls robot={robot} publishCommand={publishCommand} />

      {/* Hàng 4: Lịch sử lệnh */}
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