"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { registerUnauthorizedHandler } from "@/services/api/ApiClient";
import { bootstrapAuth, sessionExpired } from "@/store/slices/authSlice";
import { makeStore, type AppStore } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { socketService } from "@/services/socket/SocketService";
import { userStatusChanged } from "@/store/slices/userStatusSlice";

function SocketSession() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // No logged-in user → no socket connection
    if (!user?._id) {
      socketService.disconnect();
      return;
    }

    // Connect to Socket.IO
    socketService.connect();

    // Tell backend that current user is online
    socketService.announceOnline(user._id);

    // Listen for other users' online/offline status
    const unsubscribe = socketService.onUserStatus((payload) => {
      console.log("USER STATUS:", payload);
    
      dispatch(userStatusChanged(payload));
    });
    
    return () => {
      unsubscribe();
    };
  }, [user?._id, dispatch]);

  return null;
}

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

	return <Provider store={store}>
		<SocketSession />
		{children}
	</Provider>;
}
