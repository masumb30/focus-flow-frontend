import Sidebar from "./Sidebar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main page content area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}