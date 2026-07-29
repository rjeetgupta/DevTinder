import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";

/**
 * Feature slices are added here one module at a time (feed, requests,
 * connections, chat, premium land in their own modules). `authReducer`
 * comes in now because the 401 -> logout flow needs somewhere to dispatch.
 */
const rootReducer = combineReducers({
  auth: authReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
