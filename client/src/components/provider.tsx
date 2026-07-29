"use client";

import { useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  // Lazy initializer runs once per component instance, giving each
  // browser session its own store without touching refs during render.
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
