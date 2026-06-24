'use client';

import { useEffect, useRef } from 'react';

// ─── Cấu hình map (giống tablet) ───
const MAP_RES   = 0.05;
const MAP_OX    = 0.0;
const MAP_OY    = 0.0;
const MAP_PX_W  = 1135;
const MAP_PX_H  = 350;
const DISPLAY_S = 5;
const MAP_W = MAP_PX_W * DISPLAY_S;
const MAP_H = MAP_PX_H * DISPLAY_S;

function rosToDisplay(rx: number, ry: number) {
  const px = (rx - MAP_OX) / MAP_RES;
  const py = MAP_PX_H - (ry - MAP_OY) / MAP_RES;
  return { x: px * DISPLAY_S, y: py * DISPLAY_S };
}

function drawRobotIcon(ctx: CanvasRenderingContext2D, scale: number, pos: { x: number; y: number }, yawRad: number, pulseT: number) {
  const r = 14 / scale;

  // ── Vòng pulse lan tỏa (hiệu ứng "đang hoạt động") ──
  for (let i = 0; i < 3; i++) {
    const progress = (pulseT + i * 0.33) % 1;
    const pr = r * (1 + progress * 2.2);
    const alpha = 0.5 * (1 - progress);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pr, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8' + Math.round(alpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 1.5 / scale;
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(yawRad);

  // Đổ bóng nhẹ
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = (18 + Math.sin(pulseT * Math.PI * 2) * 6) / scale;

  // Thân robot
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2 / scale;
  ctx.strokeStyle = '#38bdf8';
  ctx.stroke();

  // Dải hướng phía trước — biểu thị "mặt" robot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, -Math.PI / 2.6, Math.PI / 2.6);
  ctx.lineWidth = r * 0.45;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Đèn cảm biến phía trước
  ctx.beginPath();
  ctx.arc(r * 0.85, 0, r * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.restore();
}

interface RobotLiveMapProps {
  pose: { x: number; y: number; yaw: number } | null;
}

export function RobotLiveMap({ pose }: RobotLiveMapProps) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapImageRef    = useRef<HTMLImageElement | null>(null);
  const animRef        = useRef<number>(0);
  const pulseRef       = useRef(0);
  const poseRef        = useRef(pose);

  useEffect(() => { poseRef.current = pose; }, [pose]);

  // Load ảnh bản đồ 1 lần
  useEffect(() => {
    const img = new Image();
    img.src = '/mapreal.png';
    img.onload = () => { mapImageRef.current = img; };
  }, []);

  // Animation loop — vẽ tĩnh (không zoom/pan), chỉ animate pulse robot
  useEffect(() => {
    function loop() {
      pulseRef.current = (pulseRef.current + 0.01) % 1;

      const canvas    = canvasRef.current;
      const container  = containerRef.current;
      if (!canvas || !container) { animRef.current = requestAnimationFrame(loop); return; }

      const W = container.clientWidth, H = container.clientHeight;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

      const ctx = canvas.getContext('2d');
      if (!ctx) { animRef.current = requestAnimationFrame(loop); return; }

      // Tự tính scale để map vừa khung, căn giữa (cố định, không cho zoom/pan)
      const scale  = Math.min(W / MAP_W, H / MAP_H) * 0.96;
      const offsetX = (W - MAP_W * scale) / 2;
      const offsetY = (H - MAP_H * scale) / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      if (mapImageRef.current) {
        ctx.drawImage(mapImageRef.current, 0, 0, MAP_W, MAP_H);
      }

      const currentPose = poseRef.current;
      if (currentPose) {
        const displayPos = rosToDisplay(currentPose.x, currentPose.y);
        drawRobotIcon(ctx, scale, displayPos, currentPose.yaw, pulseRef.current);
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[350px] overflow-hidden rounded-[0.95rem] bg-[#0a0f1e]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!poseRef.current && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-500">
          Đang chờ dữ liệu vị trí robot...
        </div>
      )}
    </div>
  );
}