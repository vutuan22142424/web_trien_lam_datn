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
  const [battery, setBattery]         = useState<number | null>(null);
  const [robotState, setRobotState]   = useState<string | null>(null);
  const [pose, setPose]               = useState<RobotPose | null>(null);
  const [feedback, setFeedback]       = useState<RobotFeedback | null>(null);

  const clientRef         = useRef<MqttClient | null>(null);
  const sentEventIdsRef   = useRef<Set<string>>(new Set());

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
      client.subscribe('robot/battery/soc');
      client.subscribe('robot/state/state');
      client.subscribe('robot/state/pose');
      client.subscribe('robot/state/service_feedback');
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();

      if (topic === 'robot/battery/soc') {
        const value = Number(payload);
        if (!isNaN(value)) setBattery(value);

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

  return { isConnected, battery, robotState, pose, feedback, publishCommand };
}