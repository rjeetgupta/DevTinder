import { NodeField, NodeMark } from "@/components/brand/node-mark";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <NodeField className="text-primary" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <NodeMark className="size-7" />
          <span className="text-h2">DevTinder</span>
        </div>
        <div className="glass rounded-xl p-8 shadow-xl shadow-black/20">{children}</div>
      </div>
    </main>
  );
}
