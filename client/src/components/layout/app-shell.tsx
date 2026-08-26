import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  activeHref,
  userName,
  userPhoto,
  unreadCount,
  onLogout,
  children,
}: {
  activeHref?: string;
  userName?: string;
  userPhoto?: string | null;
  unreadCount?: number;
  onLogout?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full mx-auto flex h-screen max-w-7xl gap-4 overflow-hidden p-4">
      <div
        className="ambient-orb -top-40 left-1/3 z-0 h-100 w-100 md:h-150 md:w-150"
        aria-hidden
      />
      <div className="relative z-10 flex h-full w-full min-w-0 gap-4">
        <Sidebar activeHref={activeHref} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Topbar
            userName={userName}
            userPhoto={userPhoto}
            unreadCount={unreadCount}
            onLogout={onLogout}
          />
          <main className="min-h-0 flex-1 overflow-y-auto rounded-lg pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <MobileNav activeHref={activeHref} />
      </div>
    </div>
  );
}
