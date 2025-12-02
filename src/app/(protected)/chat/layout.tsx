import { ChatInput } from './components/chat-input';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-dashboard-card relative mx-auto size-full overflow-y-auto px-5">
      <div className="mx-auto size-full max-w-4xl overflow-auto">
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-4 mx-auto w-full max-w-4xl px-5">
        <ChatInput />
      </div>
    </main>
  );
}
