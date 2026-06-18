'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Schedule, ICON_OPTIONS, COLOR_OPTIONS } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

function calculateDuration(start: string, end: string): string {
  try {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return '';
    
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let diffMin = endTotal - startTotal;
    
    if (diffMin < 0) diffMin += 24 * 60; // Handle next day
    
    if (diffMin === 0) return '';
    if (diffMin < 60) return `${diffMin} phút`;
    
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    
    return mins > 0 ? `${hours}h ${mins} phút` : `${hours}h`;
  } catch {
    return '';
  }
}

export default function ScheduleModal({ open, onOpenChange, schedule, onSave, isLoading = false }: ScheduleModalProps) {
  const { register, handleSubmit, reset, watch, control, setValue, formState: { errors } } = useForm<Omit<Schedule, 'id' | 'createdAt'>>({
    defaultValues: {
      label: '',
      time: '',
      end: '',
      duration: '',
      icon: 'Users',
      detail: '',
      accent: '#3B82F6',
      speaker: '',
    },
  });

  const timeValue = watch('time');
  const endValue = watch('end');
  const accentValue = watch('accent');

  useEffect(() => {
    if (schedule) {
      reset({
        label: schedule.label,
        time: schedule.time,
        end: schedule.end,
        duration: schedule.duration,
        icon: schedule.icon,
        detail: schedule.detail,
        accent: schedule.accent,
        speaker: schedule.speaker || '',
      });
    } else {
      reset({
        label: '',
        time: '',
        end: '',
        duration: '',
        icon: 'Users',
        detail: '',
        accent: '#3B82F6',
        speaker: '',
      });
    }
  }, [schedule, reset]);

  const onSubmit = async (data: Omit<Schedule, 'id' | 'createdAt'>) => {
    const autoCalculatedDuration = calculateDuration(data.time, data.end);
    const finalData = {
      ...data,
      duration: autoCalculatedDuration || data.duration,
    };
    
    try {
      await onSave(finalData);
      onOpenChange(false);
    } catch (error) {
      console.error('[v0] Error saving schedule:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] w-full max-w-md overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Sửa Lịch Trình' : 'Thêm Lịch Trình Mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Title/Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Tên Sự Kiện</Label>
            <Input
              id="label"
              {...register('label', { required: 'Tên sự kiện là bắt buộc' })}
              placeholder="VD: Buổi Nói Chuyện AI"
              className="border-border"
            />
            {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
          </div>

          {/* Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="time">Giờ Bắt Đầu</Label>
              <Input
                id="time"
                type="time"
                {...register('time', { required: 'Giờ bắt đầu là bắt buộc' })}
                className="border-border"
              />
              {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">Giờ Kết Thúc</Label>
              <Input
                id="end"
                type="time"
                {...register('end', { required: 'Giờ kết thúc là bắt buộc' })}
                className="border-border"
              />
              {errors.end && <p className="text-sm text-red-500">{errors.end.message}</p>}
            </div>
          </div>

          {/* Duration (Auto-calculated, read-only) */}
          <div className="space-y-2">
            <Label htmlFor="duration">Thời Lượng (Tự động)</Label>
            <Input
              id="duration"
              {...register('duration')}
              value={calculateDuration(timeValue, endValue) || ''}
              readOnly
              className="border-border bg-gray-50"
            />
            <p className="text-xs text-foreground/60">Tự động tính toán từ giờ bắt đầu và kết thúc</p>
          </div>

          {/* Icon Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="icon">Biểu Tượng</Label>
            <select
              {...register('icon', { required: 'Biểu tượng là bắt buộc' })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
          </div>

          {/* Location/Detail */}
          <div className="space-y-2">
            <Label htmlFor="detail">Địa Điểm / Chi Tiết</Label>
            <Input
              id="detail"
              {...register('detail', { required: 'Địa điểm là bắt buộc' })}
              placeholder="VD: Phòng 101 - Tòa A"
              className="border-border"
            />
            {errors.detail && <p className="text-sm text-red-500">{errors.detail.message}</p>}
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Màu Sắc</Label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue('accent', color.value)}
                  className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color.value,
                    borderColor: accentValue === color.value ? '#000' : color.value,
                    borderWidth: accentValue === color.value ? '3px' : '2px',
                  }}
                  title={color.name}
                />
              ))}
            </div>
            <input type="hidden" {...register('accent')} />
          </div>

          {/* Speaker (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="speaker">Diễn Giả (Tùy Chọn)</Label>
            <Input
              id="speaker"
              {...register('speaker')}
              placeholder="VD: Nguyễn Văn A"
              className="border-border"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full border-border sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
