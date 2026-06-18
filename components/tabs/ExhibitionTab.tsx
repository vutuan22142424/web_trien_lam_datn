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

function RobotMap({ robot }: { robot: RobotData }) {
  const position = robot.position;

  return (
    <ShellPanel>
      <div className="p-5 sm:p-7">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Live floor map</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">Bản đồ vị trí robot</h2>

        <div className="mt-5 flex items-center gap-2 text-[11px] font-bold text-slate-400 sm:hidden">
          <MoveHorizontal className="h-4 w-4 text-blue-600" />
          Vuốt ngang để xem toàn bộ bản đồ
        </div>

        <div className="mobile-snap-scroll mt-3 overflow-x-auto rounded-[1.15rem] bg-slate-100 p-1 ring-1 ring-slate-200 sm:mt-5">
          <div className="relative min-h-[350px] min-w-[720px] overflow-hidden rounded-[0.95rem] bg-[#eaf0f6] sm:min-h-[400px] sm:min-w-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(71,85,105,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.10)_1px,transparent_1px)] bg-[size:36px_36px]" />

            <div className="absolute inset-x-[8%] top-[43%] h-[14%] rounded-[0.9rem] border border-slate-300 bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
              <div className="flex h-full items-center justify-center">
                <div className="rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Smart Guided Experience Lane
                </div>
              </div>
            </div>

            <div className="absolute left-[3%] top-[43%] grid h-[14%] w-[8%] place-items-center rounded-[0.8rem] border border-cyan-200 bg-cyan-50 text-center text-[10px] font-black uppercase tracking-[0.1em] text-cyan-700">
              Gate A
            </div>
            <div className="absolute right-[3%] top-[43%] grid h-[14%] w-[8%] place-items-center rounded-[0.8rem] border border-cyan-200 bg-cyan-50 text-center text-[10px] font-black uppercase tracking-[0.1em] text-cyan-700">
              Gate B
            </div>

            {mapZones.map((zone) => (
              <div
                key={zone.name}
                className={cn(
                  'absolute grid place-items-center rounded-[0.85rem] border px-2 text-center text-[11px] font-black shadow-[0_10px_22px_rgba(15,23,42,0.07)]',
                  zone.className,
                  zone.tone,
                )}
              >
                {zone.name}
              </div>
            ))}

            <div className="absolute left-[18%] top-[49.5%] h-1 w-[40%] rounded-full bg-blue-500/20" />
            <div className="absolute left-[32%] top-[49.5%] h-1 w-[26%] rounded-full bg-blue-500/45" />

            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              aria-label={`Robot đang ở ${position.zone}`}
            >
              <div className="relative grid h-16 w-16 place-items-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 motion-safe:animate-ping" />
                <div className="absolute inset-2 rounded-full bg-blue-500/20" />
                <div className="relative grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white shadow-[0_18px_34px_rgba(15,23,42,0.28)] ring-4 ring-white">
                  <Navigation
                    className="h-5 w-5"
                    strokeWidth={2}
                    style={{ transform: `rotate(${position.heading}deg)` }}
                  />
                </div>
              </div>
            </div>
          </div>
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

function EmergencyControls({ robot }: { robot: RobotData }) {
  const [isPaused, setIsPaused] = useState(robot.telemetry.state.state === 'PAUSED');
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions = useMemo(() => {
    const dock = robot.mqtt.quickActions.find((action) => action.command === 'gotodock');
    const pause = robot.mqtt.quickActions.find((action) => action.command === 'pause');
    const resume = robot.mqtt.quickActions.find((action) => action.command === 'resume');

    return { dock, pause, resume };
  }, [robot.mqtt.quickActions]);

  const handlePauseToggle = () => {
    setIsPaused((current) => !current);
    setActiveAction(isPaused ? actions.resume?.id ?? 'resume' : actions.pause?.id ?? 'pause');
  };

  return (
    <ShellPanel className="h-full">
      <div className="flex h-full min-h-[270px] flex-col justify-center gap-3 p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setActiveAction('emergency-power-off')}
          className={cn(
            'group flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === 'emergency-power-off'
              ? 'border-rose-600 bg-rose-600 text-white shadow-[0_14px_28px_rgba(225,29,72,0.22)]'
              : 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100',
          )}
        >
          <Power className="h-5 w-5" strokeWidth={2} />
          Tắt nguồn khẩn cấp
        </button>

        <button
          type="button"
          onClick={handlePauseToggle}
          className={cn(
            'flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === (isPaused ? actions.pause?.id : actions.resume?.id)
              ? 'border-amber-500 bg-amber-500 text-white shadow-[0_14px_28px_rgba(245,158,11,0.20)]'
              : 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100',
          )}
        >
          {isPaused ? <Play className="h-5 w-5" strokeWidth={2} /> : <Pause className="h-5 w-5" strokeWidth={2} />}
          {isPaused ? 'Tiếp tục hoạt động' : 'Tạm dừng hoạt động'}
        </button>

        <button
          type="button"
          onClick={() => setActiveAction(actions.dock?.id ?? 'gotodock')}
          className={cn(
            'flex min-h-16 items-center justify-center gap-3 rounded-[1rem] border px-5 text-base font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.99]',
            activeAction === (actions.dock?.id ?? 'gotodock')
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

function MqttCommandHistory({ robot }: { robot: RobotData }) {
  return (
    <ShellPanel>
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">MQTT command stream</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">Lịch sử lệnh gửi tới robot</h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {robot.mqtt.connection}
          </span>
        </div>

        <div className="mt-5 rounded-[1rem] bg-slate-950 p-4 text-white">
          <div className="grid gap-4 text-xs sm:grid-cols-3">
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Robot state</p>
              <p className="mt-1 font-mono font-bold">{robot.telemetry.state.state}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Broker</p>
              <p className="mt-1 font-mono font-bold">{robot.mqtt.broker}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Client ID</p>
              <p className="mt-1 truncate font-mono font-bold">{robot.mqtt.clientId}</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-white/10" />
          <p className="mt-3 font-mono text-[11px] font-semibold text-white/55">Last sync: {robot.mqtt.lastSync}</p>
        </div>

        <div className="mt-5 space-y-3">
          {robot.mqtt.commands.map((command) => {
            const meta = statusMeta[command.status] ?? statusMeta.ACCEPTED;
            const StatusIcon = meta.icon;

            return (
              <article
                key={command.id}
                className="rounded-[1rem] bg-slate-50 p-4 ring-1 ring-slate-200 transition-all duration-200 hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,0.07)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-sm font-black text-slate-950">{command.command}</p>
                      <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black', meta.className)}>
                        <StatusIcon className="h-3 w-3" strokeWidth={2} />
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-2 truncate font-mono text-[11px] font-semibold text-slate-500">{command.topic}</p>
                    <p className="mt-1 truncate font-mono text-[10px] font-semibold text-slate-400">feedback: {command.feedbackTopic}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xs font-black text-slate-950">{command.latencyMs}ms</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">QoS {command.qos}</p>
                  </div>
                </div>

                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-[0.75rem] bg-white px-3 py-2 font-mono text-[11px] font-semibold leading-5 text-slate-600 ring-1 ring-slate-200">
                  {command.payload}
                </pre>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-400">
                  <span>{command.operator}</span>
                  <span className="font-mono">{command.timestamp}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </ShellPanel>
  );
}

export function ExhibitionTab({ robot }: ExhibitionTabProps) {
  return (
    <div className="space-y-6">
      <RobotMap robot={robot} />

      <section aria-label="Pin và điều khiển robot" className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <BatteryPanel battery={robot.telemetry.battery} />
        <EmergencyControls robot={robot} />
      </section>

      <MqttCommandHistory robot={robot} />
    </div>
  );
}
