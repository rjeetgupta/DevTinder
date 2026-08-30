import { NodeField, NodeMark } from "@/components/brand/node-mark";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="ambient-orb -top-32 left-1/2 -translate-x-1/2 h-100 w-100 md:h-150 md:w-150" aria-hidden />
      <NodeField className="text-primary" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <NodeMark className="size-7" />
          <span className="text-h2">DevTinder</span>
        </div>
        <div className="glass rounded-lg p-8 shadow-lg shadow-black/30">{children}</div>
      </div>
    </main>
  );
}
