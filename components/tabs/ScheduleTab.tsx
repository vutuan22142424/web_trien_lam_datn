'use client';

import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ScheduleCard from '@/components/ScheduleCard';
import ScheduleModal from '@/components/ScheduleModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useSchedules } from '@/hooks/useSchedules';

export function ScheduleTab() {
  const { schedules, loading, error, addSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const handleAddClick = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (schedule: any) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.id) {
      await deleteSchedule(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleSaveSchedule = async (data: any) => {
    if (editingSchedule?.id) {
      await updateSchedule(editingSchedule.id, data);
    } else {
      await addSchedule(data);
    }
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground/70">Đang tải lịch sự kiện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="mb-2 text-balance text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">Quản Lý Lịch Sự Kiện</h2>
          <p className="text-foreground/70">Tổng cộng {schedules.length} sự kiện</p>
        </div>
        <Button
          onClick={handleAddClick}
          className="flex w-full items-center gap-2 border-0 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={20} />
          Thêm Mới
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Schedule List */}
      {schedules.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border px-4 py-16 text-center sm:py-20">
          <p className="text-foreground/70 mb-4">Chưa có lịch sự kiện nào</p>
          <Button onClick={handleAddClick} variant="outline">
            <Plus size={20} className="mr-2" />
            Thêm lịch sự kiện đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id ?? `${schedule.time}-${schedule.label}`}
              schedule={schedule}
              onEdit={() => handleEditClick(schedule)}
              onDelete={() => {
                if (schedule.id) handleDeleteClick(schedule.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        schedule={editingSchedule}
        onSave={handleSaveSchedule}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
