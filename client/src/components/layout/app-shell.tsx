import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  activeHref,
  userName,
  unreadCount,
  children,
}: {
  activeHref?: string;
  userName?: string;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-screen max-w-7xl gap-4 p-4">
      <Sidebar activeHref={activeHref} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Topbar userName={userName} unreadCount={unreadCount} />
        <main className="min-h-0 flex-1 overflow-y-auto rounded-xl">{children}</main>
      </div>
    </div>
  );
}
