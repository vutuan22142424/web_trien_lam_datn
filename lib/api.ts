const API_URL = 'https://69f458c0bd2396bf5310c8bf.mockapi.io/schedules';

export interface Schedule {
  id?: string;
  time: string;
  end: string;
  duration: string;
  icon: string;
  label: string;
  detail: string;
  accent: string;
  speaker?: string;
  createdAt?: string;
}

export const ICON_OPTIONS = ['Users', 'Mic', 'MapPin', 'CalendarDays', 'Utensils', 'Trophy'] as const;

export const COLOR_OPTIONS = [
  { name: 'Xanh',    value: '#3B82F6' },
  { name: 'Tím',     value: '#A855F7' },
  { name: 'Hồng',    value: '#EC4899' },
  { name: 'Xanh Lá', value: '#22C55E' },
  { name: 'Cam',     value: '#F97316' },
  { name: 'Đỏ',      value: '#EF4444' },
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────

// Chuẩn hóa "7:00" → "07:00"
function padTime(time: string): string {
  const [h, m] = time.split(':');
  return `${h.padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}`;
}

// Tự tính duration từ time và end
function calcDuration(time: string, end: string): string {
  const [sh, sm] = time.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const totalMin = (eh * 60 + em) - (sh * 60 + sm);

  if (totalMin <= 0) return '';
  if (totalMin < 60) return `${totalMin} phút`;

  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} giờ` : `${h}h ${m} phút`;
}

// Chuẩn hóa payload trước khi gửi lên API
function buildPayload(schedule: Omit<Schedule, 'id' | 'createdAt'>) {
  const time = padTime(schedule.time);
  const end  = padTime(schedule.end);
  return {
    time,
    end,
    duration: calcDuration(time, end),  // tự tính, không dùng input
    icon:     schedule.icon,
    label:    schedule.label,
    detail:   schedule.detail,
    accent:   schedule.accent.toLowerCase(), // chuẩn hóa về lowercase
    speaker:  schedule.speaker ?? '',
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getSchedules(): Promise<Schedule[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    return await response.json();
  } catch (error) {
    console.error('[api] Error fetching schedules:', error);
    throw error;
  }
}

export async function createSchedule(schedule: Omit<Schedule, 'id' | 'createdAt'>): Promise<Schedule> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(schedule)),
    });
    if (!response.ok) throw new Error('Failed to create schedule');
    return await response.json();
  } catch (error) {
    console.error('[api] Error creating schedule:', error);
    throw error;
  }
}

export async function updateSchedule(id: string, schedule: Omit<Schedule, 'id' | 'createdAt'>): Promise<Schedule> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(schedule)),
    });
    if (!response.ok) throw new Error('Failed to update schedule');
    return await response.json();
  } catch (error) {
    console.error('[api] Error updating schedule:', error);
    throw error;
  }
}

export async function deleteSchedule(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete schedule');
  } catch (error) {
    console.error('[api] Error deleting schedule:', error);
    throw error;
  }
}