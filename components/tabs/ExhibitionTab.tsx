'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  Home,
  Navigation,
  Pause,
  Play,
  Power,
  Radio,
  Satellite,
  Send,
  Server,
  Signal,
  Thermometer,
  Timer,
  Zap,
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

type TopicGroup = {
  name: string;
  topics: string[];
};

type ActionTone = 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';

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

type RobotPosition = {
  zone: string;
  x: number;
  y: number;
  heading: number;
  accuracy: string;
  lastPing: string;
};

type RobotTelemetry = {
  battery: {
    soc: number;
    voltage: number;
    current: number;
    power: number;
    ocv: number;
    cell_v: number;
    charging_state: string;
    charging: boolean;
    latch: boolean;
    soc_init: boolean;
    uptime_s: number;
  };
  state: {
    time: number;
    state: string;
    activeCommandId: string;
    queueDepth: number;
  };
  pose: {
    time: number;
    x: number;
    y: number;
    yaw: number;
  };
  service: {
    activeRequest: string;
    todaySucceeded: number;
    todayFailed: number;
    todayRejected: number;
    medianLatencyMs: number;
  };
};

type RobotData = {
  name: string;
  status: string;
  model: string;
  version: string;
  batteryLevel: number;
  temperatureSensor: number;
  uptime: number;
  specifications: {
    cameras: number;
    microphones: number;
  };
  currentLocation: string;
  nextScheduledMaintenance: string;
  position: RobotPosition;
  telemetry: RobotTelemetry;
  mqtt: {
    broker: string;
    clientId: string;
    connection: string;
    lastSync: string;
    topicGroups: TopicGroup[];
    quickActions: QuickRobotAction[];
    commands: MqttCommand[];
  };
};

type AnalyticsData = Record<string, unknown>;

interface ExhibitionTabProps {
  analytics: AnalyticsData;
  robot: RobotData;
}

const statusMeta: Record<string, { label: string; className: string; icon: LucideIcon }> = {
  ACCEPTED: {
    label: 'ACCEPTED',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  QUEUED_WHILE_PAUSED: {
    label: 'QUEUED',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Clock3,
  },
  EXECUTING: {
    label: 'EXECUTING',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Activity,
  },
  PREEMPTED: {
    label: 'PREEMPTED',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Signal,
  },
  PAUSED: {
    label: 'PAUSED',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Clock3,
  },
  CANCELING: {
    label: 'CANCELING',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Clock3,
  },
  CANCELED: {
    label: 'CANCELED',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
    icon: XCircle,
  },
  SUCCEEDED: {
    label: 'SUCCEEDED',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  FAILED: {
    label: 'FAILED',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: XCircle,
  },
  REJECTED: {
    label: 'REJECTED',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: XCircle,
  },
  DOCKED: {
    label: 'DOCKED',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
    icon: CheckCircle2,
  },
  DOCK_FAILED: {
    label: 'DOCK FAILED',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: XCircle,
  },
  PREEMPTED_BY_DOCK: {
    label: 'DOCK PREEMPT',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Signal,
  },
};

const metricTone = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const actionTone: Record<ActionTone, { idle: string; active: string; icon: string }> = {
  blue: {
    idle: 'bg-blue-50 text-blue-700 ring-blue-100',
    active: 'bg-blue-500 text-white ring-blue-400',
    icon: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  emerald: {
    idle: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    active: 'bg-emerald-500 text-white ring-emerald-400',
    icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  amber: {
    idle: 'bg-amber-50 text-amber-700 ring-amber-100',
    active: 'bg-amber-500 text-white ring-amber-400',
    icon: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  rose: {
    idle: 'bg-rose-50 text-rose-700 ring-rose-100',
    active: 'bg-rose-500 text-white ring-rose-400',
    icon: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
  slate: {
    idle: 'bg-slate-100 text-slate-700 ring-slate-200',
    active: 'bg-slate-950 text-white ring-slate-800',
    icon: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
};

const actionIconMap: Record<string, LucideIcon> = {
  gotodock: Home,
  pause: Pause,
  resume: Play,
  wakeup: Power,
  cancel_request: XCircle,
  service_request: Send,
};

function getActionTone(tone: string): ActionTone {
  return tone in actionTone ? (tone as ActionTone) : 'slate';
}

const mapZones = [
  { name: 'Coca-Cola', className: 'left-[10%] top-[12%] h-[19%] w-[12%]', tone: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'Pepsi', className: 'left-[23.5%] top-[12%] h-[19%] w-[12%]', tone: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Red Bull', className: 'left-[37%] top-[12%] h-[19%] w-[12%]', tone: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'Heineken', className: 'left-[50.5%] top-[12%] h-[19%] w-[12%]', tone: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Tiger', className: 'left-[64%] top-[12%] h-[19%] w-[12%]', tone: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Sabeco', className: 'left-[77.5%] top-[12%] h-[19%] w-[12%]', tone: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'Abbott', className: 'left-[16%] bottom-[12%] h-[18%] w-[16%]', tone: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { name: 'Nutifood', className: 'left-[36.5%] bottom-[12%] h-[18%] w-[16%]', tone: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Nestlé', className: 'left-[57%] bottom-[12%] h-[18%] w-[16%]', tone: 'bg-rose-100 text-rose-700 border-rose-200' },
  { name: 'Vinamilk', className: 'left-[77.5%] bottom-[12%] h-[18%] w-[16%]', tone: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
];

function ShellPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[1.6rem] bg-white/72 p-1 ring-1 ring-slate-200/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)]', className)}>
      <div className="h-full rounded-[1.3rem] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        {children}
      </div>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
  tone = 'slate',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: keyof typeof metricTone;
}) {
  return (
    <div className="group rounded-[1.1rem] bg-white p-1 ring-1 ring-slate-200 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
      <div className="h-full rounded-[0.9rem] bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className={cn('grid h-9 w-9 place-items-center rounded-[0.8rem] ring-1', metricTone[tone])}>
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="font-mono text-xl font-black tabular-nums text-slate-950">{value}</span>
        </div>
        <p className="mt-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

function RobotMap({ robot }: { robot: RobotData }) {
  const position = robot.position;
  const pose = robot.telemetry.pose;

  return (
    <ShellPanel className="lg:col-span-2">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Live floor map</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Bản đồ vị trí robot</h3>
            <p className="mt-2 max-w-[58ch] text-sm font-medium leading-6 text-slate-500">
              Vị trí được lấy từ trạng thái điều hướng hiện tại của {robot.name}. Marker hiển thị theo phần trăm trên mặt bằng triển lãm.
            </p>
          </div>
          <div className="rounded-[1rem] bg-slate-950 px-4 py-3 text-white shadow-[0_16px_38px_rgba(15,23,42,0.18)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Current zone</p>
            <p className="mt-1 text-sm font-black">{position.zone}</p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.25rem] bg-slate-100 p-1 ring-1 ring-slate-200">
          <div className="relative min-h-[420px] overflow-hidden rounded-[1rem] bg-[#eaf0f6]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(71,85,105,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.10)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute inset-x-[8%] top-[43%] h-[14%] rounded-[1rem] border border-slate-300 bg-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
              <div className="flex h-full items-center justify-center">
                <div className="rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Smart Guided Experience Lane
                </div>
              </div>
            </div>

            <div className="absolute left-[3%] top-[43%] grid h-[14%] w-[8%] place-items-center rounded-[0.9rem] border border-cyan-200 bg-cyan-50 text-center text-[10px] font-black uppercase tracking-[0.1em] text-cyan-700">
              Gate A
            </div>
            <div className="absolute right-[3%] top-[43%] grid h-[14%] w-[8%] place-items-center rounded-[0.9rem] border border-cyan-200 bg-cyan-50 text-center text-[10px] font-black uppercase tracking-[0.1em] text-cyan-700">
              Gate B
            </div>
            {mapZones.map((zone) => (
              <div key={zone.name} className={cn('absolute grid place-items-center rounded-[0.95rem] border px-2 text-center text-[11px] font-black shadow-[0_10px_22px_rgba(15,23,42,0.07)]', zone.className, zone.tone)}>
                {zone.name}
              </div>
            ))}

            <div className="absolute left-[18%] top-[49.5%] h-1 w-[40%] rounded-full bg-blue-500/20" />
            <div className="absolute left-[32%] top-[49.5%] h-1 w-[26%] rounded-full bg-blue-500/45" />

            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Pose x/y</p>
            <p className="mt-1 font-mono text-lg font-black text-slate-950">{pose.x.toFixed(2)}, {pose.y.toFixed(2)}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">Accuracy {position.accuracy}</p>
          </div>
          <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Yaw</p>
            <p className="mt-1 font-mono text-lg font-black text-slate-950">{pose.yaw.toFixed(2)} rad</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">robot/state/pose</p>
          </div>
          <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Heading</p>
            <p className="mt-1 font-mono text-lg font-black text-slate-950">{position.heading}°</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">Map marker</p>
          </div>
          <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Ping cuối</p>
            <p className="mt-1 font-mono text-xs font-black text-slate-950">{position.lastPing}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">Live sync</p>
          </div>
        </div>
      </div>
    </ShellPanel>
  );
}

function QuickRobotActions({ robot }: { robot: RobotData }) {
  const actions = robot.mqtt.quickActions;
  const firstAction = actions[0];
  const [selectedActionId, setSelectedActionId] = useState(firstAction?.id ?? '');
  const [preparedAt, setPreparedAt] = useState(robot.mqtt.lastSync);
  const selectedAction = actions.find((action) => action.id === selectedActionId) ?? firstAction;

  if (!selectedAction) {
    return null;
  }

  const SelectedIcon = actionIconMap[selectedAction.command] ?? Radio;

  function handleAction(action: QuickRobotAction) {
    setSelectedActionId(action.id);
    setPreparedAt(new Date().toLocaleTimeString('vi-VN', { hour12: false }));
  }

  return (
    <ShellPanel>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Quick MQTT actions</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Lệnh nhanh cho robot</h3>
          </div>
          <div className="rounded-[0.95rem] bg-slate-950 px-3 py-2 text-right text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Prepared</p>
            <p className="mt-1 font-mono text-xs font-black">{preparedAt}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = actionIconMap[action.command] ?? Send;
            const tone = getActionTone(action.tone);
            const isSelected = action.id === selectedAction.id;

            return (
              <button
                key={action.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleAction(action)}
                className={cn(
                  'group min-h-[74px] rounded-[1rem] p-1 text-left ring-1 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.99]',
                  isSelected ? 'bg-slate-950 ring-slate-800 shadow-[0_18px_38px_rgba(15,23,42,0.18)]' : 'bg-slate-50 ring-slate-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,0.07)]',
                )}
              >
                <span className={cn('flex h-full items-start gap-3 rounded-[0.85rem] px-3 py-3', isSelected ? 'bg-white/7 text-white' : 'text-slate-800')}>
                  <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-[0.8rem] ring-1', isSelected ? actionTone[tone].active : actionTone[tone].icon)}>
                    <Icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5">{action.label}</span>
                    <span className={cn('mt-1 block truncate font-mono text-[10px] font-bold', isSelected ? 'text-white/48' : 'text-slate-400')}>
                      {action.topic}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-[1rem] bg-slate-950 p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Selected command</p>
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-[0.75rem] ring-1', actionTone[getActionTone(selectedAction.tone)].active)}>
                  <SelectedIcon className="h-4 w-4" strokeWidth={1.9} />
                </span>
                <p className="truncate font-mono text-sm font-black">{selectedAction.command}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/8 px-2.5 py-1 font-mono text-[10px] font-black text-white/70">
              QoS {selectedAction.qos}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-xs">
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Topic</p>
              <p className="mt-1 truncate font-mono font-bold text-white">{selectedAction.topic}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Feedback</p>
              <p className="mt-1 truncate font-mono font-bold text-white">{selectedAction.feedbackTopic}</p>
            </div>
          </div>

          <pre className="mt-4 max-h-32 overflow-auto rounded-[0.8rem] bg-white/8 px-3 py-2 font-mono text-[11px] font-semibold leading-5 text-white/72 ring-1 ring-white/10">
            {selectedAction.payload}
          </pre>
        </div>
      </div>
    </ShellPanel>
  );
}

function MqttCommandHistory({ robot }: { robot: RobotData }) {
  const commands = robot.mqtt.commands;
  const state = robot.telemetry.state;

  return (
    <ShellPanel>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">MQTT command stream</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Lịch sử lệnh gửi tới robot</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>

        <div className="mt-5 rounded-[1rem] bg-slate-950 p-4 text-white">
          <div className="grid gap-3 text-xs sm:grid-cols-3">
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Robot state</p>
              <p className="mt-1 font-mono font-bold text-white">{state.state}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Broker</p>
              <p className="mt-1 font-mono font-bold text-white">{robot.mqtt.broker}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-white/35">Client ID</p>
              <p className="mt-1 truncate font-mono font-bold text-white">{robot.mqtt.clientId}</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-white/10" />
          <p className="mt-3 font-mono text-[11px] font-semibold text-white/55">Last sync: {robot.mqtt.lastSync}</p>
        </div>

        <div className="mt-5 space-y-3">
          {commands.map((command) => {
            const meta = statusMeta[command.status] ?? statusMeta.ACCEPTED;
            const StatusIcon = meta.icon;

            return (
              <article key={command.id} className="rounded-[1.1rem] bg-slate-50 p-4 ring-1 ring-slate-200 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white hover:shadow-[0_16px_38px_rgba(15,23,42,0.07)]">
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
                <pre className="mt-3 overflow-hidden rounded-[0.8rem] bg-white px-3 py-2 font-mono text-[11px] font-semibold leading-5 text-slate-600 ring-1 ring-slate-200">
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

function RobotReadiness({ robot }: { robot: RobotData }) {
  const battery = robot.telemetry.battery;
  const uptimeHours = (battery.uptime_s / 3600).toFixed(1);

  return (
    <ShellPanel>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-[1.2rem] bg-slate-100 ring-1 ring-slate-200">
            <Image src="/images/robot.jpg" alt={robot.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">{robot.name}</h3>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                Online
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">{robot.model}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Battery SoC</span>
              <span className="font-mono text-sm font-black text-slate-950">{battery.soc}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${battery.soc}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">{battery.voltage}V · {battery.charging_state} · robot/battery/status</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1rem] bg-slate-50 p-3">
              <Zap className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <p className="mt-2 font-mono text-lg font-black text-slate-950">{battery.current}A</p>
              <p className="text-xs font-semibold text-slate-500">Current</p>
            </div>
            <div className="rounded-[1rem] bg-slate-50 p-3">
              <Gauge className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <p className="mt-2 font-mono text-lg font-black text-slate-950">{battery.power}W</p>
              <p className="text-xs font-semibold text-slate-500">Power draw</p>
            </div>
            <div className="rounded-[1rem] bg-slate-50 p-3">
              <Thermometer className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <p className="mt-2 font-mono text-lg font-black text-slate-950">{robot.temperatureSensor}°C</p>
              <p className="text-xs font-semibold text-slate-500">Nhiệt độ</p>
            </div>
            <div className="rounded-[1rem] bg-slate-50 p-3">
              <Timer className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <p className="mt-2 font-mono text-lg font-black text-slate-950">{uptimeHours}h</p>
              <p className="text-xs font-semibold text-slate-500">Uptime</p>
            </div>
          </div>
          <div className="rounded-[1rem] bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Vị trí hiện tại</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{robot.currentLocation}</p>
          </div>
        </div>
      </div>
    </ShellPanel>
  );
}

function MqttTopicContract({ robot }: { robot: RobotData }) {
  return (
    <ShellPanel>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">MQTT topic contract</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Luồng dữ liệu robot</h3>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.95rem] bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            <Database className="h-4 w-4" strokeWidth={1.9} />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {robot.mqtt.topicGroups.map((group, index) => {
            const Icon = index === 0 ? BatteryCharging : Server;

            return (
              <div key={group.name} className="rounded-[1rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.8rem] bg-white text-slate-700 ring-1 ring-slate-200">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <p className="truncate text-sm font-black text-slate-800">{group.name}</p>
                  </div>
                  <span className="font-mono text-xs font-black text-slate-500">{group.topics.length} topics</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {group.topics.map((topic) => (
                    <span key={topic} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-slate-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ShellPanel>
  );
}

export function ExhibitionTab({ robot }: ExhibitionTabProps) {
  const { battery, pose, service, state } = robot.telemetry;
  const serviceTotal = service.todaySucceeded + service.todayFailed + service.todayRejected;
  const serviceReliability = Math.round((service.todaySucceeded / Math.max(serviceTotal, 1)) * 100);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-1 shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#0f172a_0%,#172033_45%,#10251f_100%)] px-5 py-6 text-white sm:px-7 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white/70">
                <Radio className="h-3.5 w-3.5 text-emerald-300" strokeWidth={1.8} />
                Robot operations
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                Trung tâm điều phối {robot.name}
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/62">
                Theo dõi vị trí robot, trạng thái hệ thống và các lệnh MQTT đã gửi từ bảng điều khiển vận hành.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.4rem] bg-white/8 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/42">Service feedback</span>
                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-black text-emerald-200">{serviceReliability}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-300" style={{ width: `${serviceReliability}%` }} />
              </div>
              <p className="text-xs font-semibold leading-5 text-white/50">
                {service.todaySucceeded} succeeded · {service.todayFailed + service.todayRejected} cần xem lại · bảo trì {robot.nextScheduledMaintenance}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Server} label="Robot state" value={state.state} detail={`Active ${state.activeCommandId} · queue ${state.queueDepth}`} tone="blue" />
        <MetricTile icon={BatteryCharging} label="Battery telemetry" value={`${battery.soc}%`} detail={`${battery.voltage}V · ${battery.current}A · ${battery.charging_state}`} tone="emerald" />
        <MetricTile icon={Satellite} label="Pose stream" value={`${pose.x.toFixed(2)}, ${pose.y.toFixed(2)}`} detail={`yaw ${pose.yaw.toFixed(2)} rad · robot/state/pose`} tone="amber" />
        <MetricTile icon={Gauge} label="Command latency" value={`${service.medianLatencyMs}ms`} detail={`QoS 1 · ${robot.mqtt.commands.length} recent commands`} tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(390px,0.9fr)]">
        <div className="grid gap-6">
          <RobotMap robot={robot} />
          <div className="grid gap-6 lg:grid-cols-2">
            <RobotReadiness robot={robot} />
            <MqttTopicContract robot={robot} />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <QuickRobotActions robot={robot} />
          <MqttCommandHistory robot={robot} />
        </div>
      </div>
    </div>
  );
}
