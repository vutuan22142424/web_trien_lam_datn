'use client';

import { useState, useCallback, useEffect } from 'react';
import { Schedule, getSchedules, createSchedule, updateSchedule, deleteSchedule } from '@/lib/api';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const sortByTime = (items: Schedule[]) =>
      [...items].sort((a, b) => a.time.localeCompare(b.time));
  // Fetch all schedules on component mount
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchedules();
      setSchedules(sortByTime(data)); // ← thêm sort
    } catch (err) {
      setError('Không thể tải lịch trình');
      console.error('[v0] Error in fetchSchedules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Create new schedule
  //Gọi API tạo mới → chèn kết quả vào đầu mảng schedules
  const addSchedule = useCallback(async (schedule: Omit<Schedule, 'id' | 'createdAt'>) => {
    try {
      const newSchedule = await createSchedule(schedule);
      setSchedules(prev => sortByTime([...prev, newSchedule])); // ← sort
      return newSchedule;
    } catch (err) {
      setError('Không thể tạo lịch trình');
      throw err;
    }
  }, []);

  // Update existing schedule
  //Gọi API sửa → thay thế đúng phần tử có id trùng trong mảng
  const editSchedule = useCallback(async (id: string, schedule: Omit<Schedule, 'id' | 'createdAt'>) => {
    try {
      const updated = await updateSchedule(id, schedule);
      setSchedules(prev => sortByTime(prev.map(s => s.id === id ? updated : s))); // ← sort
      return updated;
    } catch (err) {
      setError('Không thể cập nhật lịch trình');
      throw err;
    }
  }, []);

  // Delete schedule
  const removeSchedule = useCallback(async (id: string) => {
    try {
      await deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError('Không thể xóa lịch trình');
      throw err;
    }
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule: editSchedule,
    deleteSchedule: removeSchedule,
  };
}
