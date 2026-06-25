// hooks/useRobotMQTT.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export interface RobotPose {
  x: number;
  y: number;
  yaw: number;
}

export interface RobotFeedback {
  command_id: string;
  status: string;
}

const BROKER_URL  = process.env.NEXT_PUBLIC_MQTT_BROKER!;
const MQTT_USER   = process.env.NEXT_PUBLIC_MQTT_USER ?? '';
const MQTT_PASS   = process.env.NEXT_PUBLIC_MQTT_PASS ?? '';

export function useRobotMQTT() {
  const [isConnected, setIsConnected] = useState(false);
  const [robotState, setRobotState]   = useState<string | null>(null);
  const [pose, setPose]               = useState<RobotPose | null>(null);
  const [feedback, setFeedback]       = useState<RobotFeedback | null>(null);
const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const clientRef         = useRef<MqttClient | null>(null);
  const sentEventIdsRef   = useRef<Set<string>>(new Set());
const [drawerState, setDrawerState] = useState<DrawerState | null>(null);
  const [latestNotification, setLatestNotification] = useState<AppNotification | null>(null);

const lowBatteryNotifiedRef = useRef(false);
  // Theo dõi RIÊNG từng ngăn đang kẹt, không dùng 1 biến boolean chung —
  // nếu dùng 1 biến chung, ngăn 2 kẹt ngay sau ngăn 1 sẽ bị coi là "đã
  // thông báo rồi" và bị bỏ qua, dù là 2 sự cố độc lập ở 2 ngăn khác nhau.
  const drawerJamNotifiedRef = useRef<Set<number>>(new Set());

  const pushNotification = useCallback((type: string, message: string, meta?: any) => {
    setLatestNotification({ type, message, meta });
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, meta }),
    }).catch(err => console.error('❌ Lưu thông báo lỗi:', err));
  }, []);

  useEffect(() => {
    const client = mqtt.connect(BROKER_URL, {
      username: MQTT_USER,
      password: MQTT_PASS,
      connectTimeout: 5000,
      reconnectPeriod: 3000,
    });
    clientRef.current = client;

    client.on('connect', () => {
      setIsConnected(true);
      client.subscribe('robot/battery/status');
      client.subscribe('robot/state/state');
      client.subscribe('robot/state/pose');
      client.subscribe('robot/state/service_feedback');
      client.subscribe('robot/drawer/state');
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();

      if (topic === 'robot/battery/status') {
                  try {
          const parsed: BatteryStatus = JSON.parse(payload);
          setBatteryStatus(parsed);
          fetch('/api/battery/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              voltage:  parsed.voltage,
              current:  parsed.current,
              soc:      parsed.soc,
              power:    parsed.power,
              charging: parsed.charging,
            }),
          }).catch(err => console.error('❌ Ingest battery lỗi:', err));
        // ── Phát hiện pin yếu ──
                  if (parsed.soc < 20) {
                    if (!lowBatteryNotifiedRef.current) {
                      lowBatteryNotifiedRef.current = true;
                      pushNotification('LOW_BATTERY', `Pin yếu: còn ${parsed.soc.toFixed(1)}%`, { soc: parsed.soc });
                    }
                  } else {
                    lowBatteryNotifiedRef.current = false;   // reset khi pin hồi lại trên 20%
                  }
                } catch (err) {
                  console.error('❌ Parse battery/status lỗi', err);
                }

              } else if (topic === 'robot/drawer/state') {   // ← THÊM
                try {
                  const data: DrawerState = JSON.parse(payload);
                  setDrawerState(data);

                  if (data.state === 'JAMMED') {
                    // Chỉ thông báo nếu CHÍNH NGĂN NÀY chưa được thông báo
                    // (so với trước: kiểm tra theo từng drawer, không phải
                    // một cờ chung cho cả robot).
                    if (!drawerJamNotifiedRef.current.has(data.drawer)) {
                      drawerJamNotifiedRef.current.add(data.drawer);
                      pushNotification('DRAWER_JAM', `Ngăn ${data.drawer} bị kẹt!`, { drawer: data.drawer });
                    }
                  } else if (data.state === 'CLOSED' || data.state === 'JAM-RETRYING') {
                    // Pi5 gửi CLOSED cả khi đóng/mở ngăn bình thường (không
                    // có sự cố gì), nên KHÔNG thể coi mọi CLOSED là "đã hết
                    // kẹt". Chỉ tạo thông báo "hết kẹt" khi ngăn này ĐANG có
                    // trong drawerJamNotifiedRef — nghĩa là nó thực sự từng
                    // được báo JAMMED trước đó và chưa được giải quyết.
                    if (data.state === 'CLOSED' && drawerJamNotifiedRef.current.has(data.drawer)) {
                      pushNotification('DRAWER_RESOLVED', `Đã hết kẹt ngăn ${data.drawer}`, { drawer: data.drawer });
                    }
                    drawerJamNotifiedRef.current.delete(data.drawer);
                  }
                } catch (err) {
                  console.error('❌ Parse drawer/state lỗi', err);
                }

      } else if (topic === 'robot/state/state') {
        try {
          const parsed = JSON.parse(payload);
          const state = parsed?.data?.state ?? parsed?.state ?? payload;
          if (state) setRobotState(state);
        } catch {
          setRobotState(payload);
        }

      } else if (topic === 'robot/state/pose') {
        try {
          const parsed = JSON.parse(payload);
          const inner = parsed?.data ?? parsed;
          if (typeof inner.x === 'number') {
            setPose({ x: inner.x, y: inner.y, yaw: inner.yaw });
          }
        } catch {}

      } else if (topic === 'robot/state/service_feedback') {
        try {
          const parsed = JSON.parse(payload);
          const inner = parsed?.data ?? parsed;
          const data: RobotFeedback = { command_id: inner.command_id, status: inner.status };
          if (data.status) {
            setFeedback(data);

            const eventId = `${inner.command_id}_${inner.status}`; //eventId = "cmd_001_SUCCESS"
            if (!sentEventIdsRef.current.has(eventId)) {   // ban đầu rỗng set {}
              sentEventIdsRef.current.add(eventId); // lúc này mới  set {cmd_001_SUCCESS}
              fetch('/api/commands/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  command_id: inner.command_id,
                  status: inner.status,
                  eventId,
                }),
              }).catch(err => console.error('❌ Lưu lịch sử lệnh lỗi:', err));
            }
          }
        } catch (err) {
          console.error('❌ Parse service_feedback lỗi', err);
        }
      }
    });

    client.on('close',   () => setIsConnected(false));
    client.on('offline', () => setIsConnected(false));
    client.on('error', (err) => console.error('❌ MQTT Error:', err.message));

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, []);

  const publishCommand = useCallback((topic: string, payload: any) => {
    if (!clientRef.current?.connected) {
      console.warn('⚠️ MQTT chưa kết nối');
      return;
    }
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    clientRef.current.publish(topic, message);
  }, []);

  return { isConnected, batteryStatus, robotState, pose, feedback, drawerState, latestNotification, publishCommand };
}
export interface BatteryStatus {
  soc: number;
  voltage: number;
  current: number;
  power: number;
  ocv: number;
  cell_v: number;
  charging: boolean;
  latch: boolean;
  pi_status: string;
  uptime_s: number;
}
export interface DrawerState {
  drawer: number;
  state: string;   // 'JAM-RETRYING' | 'JAMMED' | 'CLOSED' | ...
}

export interface AppNotification {
  type: string;
  message: string;
  meta?: any;
}
