export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full p-5 pt-4 pb-8">
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  );
}
