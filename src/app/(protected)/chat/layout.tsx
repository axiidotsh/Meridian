export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto size-full px-5">
      <div className="mx-auto size-full max-w-4xl">{children}</div>
    </main>
  );
}
