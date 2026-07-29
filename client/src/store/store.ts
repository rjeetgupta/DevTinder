import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import connectionReducer from "./slices/connectionSlice";
import feedReducer from "./slices/feedSlice";
import requestReducer from "./slices/requestSlice";

/**
 * Feature slices are added here one module at a time (chat, premium
 * land in their own modules).
 */
const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  requests: requestReducer,
  connections: connectionReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
