"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { registerUnauthorizedHandler } from "@/services/api/ApiClient";
import { bootstrapAuth, sessionExpired } from "@/store/slices/authSlice";
import { makeStore, type AppStore } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  // Lazy initializer runs once per component instance, giving each
  // browser session its own store without touching refs during render.
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    // Any 401 from the API funnels here, clearing the client-side session
    // without the ApiClient module needing to import the store directly.
    registerUnauthorizedHandler(() => store.dispatch(sessionExpired()));
    // Silently check for an existing session on first load.
    store.dispatch(bootstrapAuth());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
