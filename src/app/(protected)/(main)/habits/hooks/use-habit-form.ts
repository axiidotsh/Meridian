'use client';

import { useState } from 'react';

interface HabitFormValues {
  title: string;
  description: string;
  category: string;
}

export function useHabitForm(initialValues?: Partial<HabitFormValues>) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? ''
  );
  const [category, setCategory] = useState(initialValues?.category ?? '');

  function reset() {
    setTitle('');
    setDescription('');
    setCategory('');
  }

  function getFormData() {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
    };
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    reset,
    getFormData,
  };
}
