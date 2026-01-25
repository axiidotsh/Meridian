'use client';

import { useSetAtom } from 'jotai';
import { deletingHabitIdAtom, editingHabitIdAtom } from '../atoms/dialog-atoms';
import { useToggleHabit } from './mutations/use-toggle-habit';

export function useHabitActions(habitId?: string) {
  const setEditingHabitId = useSetAtom(editingHabitIdAtom);
  const setDeletingHabitId = useSetAtom(deletingHabitIdAtom);
  const { toggleToday, toggleDate } = useToggleHabit(habitId);

  function handleToggle(id: string) {
    toggleToday.mutate({ param: { id } });
  }

  function handleToggleDate(id: string, date: Date) {
    const localYear = date.getFullYear();
    const localMonth = date.getMonth();
    const localDay = date.getDate();
    const utcDate = new Date(Date.UTC(localYear, localMonth, localDay));
    toggleDate.mutate({
      param: { id },
      json: { date: utcDate.toISOString() },
    });
  }

  function handleEdit(id: string) {
    setEditingHabitId(id);
  }

  function handleDelete(id: string) {
    setDeletingHabitId(id);
  }

  return {
    handleToggle,
    handleToggleDate,
    handleEdit,
    handleDelete,
    isToggling: toggleToday.isPending || toggleDate.isPending,
  };
}
