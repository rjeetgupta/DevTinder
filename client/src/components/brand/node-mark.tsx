import { cn } from "@/lib/utils";

/**
 * DevTinder's signature mark: two nodes joined by a connecting arc.
 * Used next to the wordmark, and (faintly, larger) as background texture
 * on empty states / hero panels via <NodeField />.
 */
export function NodeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <path
        d="M9 21C13 15 19 15 23 9"
        stroke="url(#nodemark-gradient)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="9" cy="21" r="4" fill="url(#nodemark-gradient)" />
      <circle cx="23" cy="9" r="4" fill="url(#nodemark-gradient)" fillOpacity="0.55" />
      <defs>
        <linearGradient
          id="nodemark-gradient"
          x1="9"
          y1="21"
          x2="23"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * A quiet field of scattered node-arc pairs, used as background texture
 * on hero/empty-state panels. Purely decorative — kept low-opacity so it
 * never competes with foreground content.
 */
export function NodeField({ className }: { className?: string }) {
  const nodes = [
    { x1: 20, y1: 40, x2: 90, y2: 15 },
    { x1: 160, y1: 70, x2: 230, y2: 30 },
    { x1: 60, y1: 130, x2: 20, y2: 190 },
    { x1: 260, y1: 150, x2: 220, y2: 200 },
    { x1: 140, y1: 20, x2: 150, y2: 90 },
  ];

  return (
    <svg
      viewBox="0 0 280 220"
      className={cn("pointer-events-none absolute inset-0 size-full opacity-[0.07]", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {nodes.map((n, i) => (
        <g key={i}>
          <path
            d={`M${n.x1} ${n.y1} Q ${(n.x1 + n.x2) / 2} ${Math.min(n.y1, n.y2) - 20}, ${n.x2} ${n.y2}`}
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx={n.x1} cy={n.y1} r="3" fill="currentColor" />
          <circle cx={n.x2} cy={n.y2} r="3" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
