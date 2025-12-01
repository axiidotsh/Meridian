'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChatInput } from './components/chat-input';

const categories = ['Habits', 'Tasks', 'Focus', 'Analytics'] as const;
type Category = (typeof categories)[number];

const prompts: Record<Category, string[]> = {
  Habits: [
    'Show my habit completion rate this week',
    'What habits am I struggling with?',
    'Create a new morning routine habit',
    'Analyze my most consistent habits',
  ],
  Tasks: [
    'What are my high priority tasks today?',
    'Show overdue tasks',
    'Create a task for tomorrow',
    'Summarize my task completion trends',
  ],
  Focus: [
    'How much time did I focus this week?',
    'Start a focus session',
    'What are my most productive hours?',
    'Compare my focus time to last month',
  ],
  Analytics: [
    'Show my overall productivity trends',
    'What day of the week am I most productive?',
    'Generate a weekly productivity report',
    'Compare this month to last month',
  ],
};

export default function ChatPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Habits');

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Welcome back!</h1>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="outline"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {prompts[selectedCategory].map((prompt, index) => (
            <Button key={index} variant="ghost" className="justify-start">
              {prompt}
            </Button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5">
        <ChatInput />
      </div>
    </div>
  );
}
