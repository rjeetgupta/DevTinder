import { combineReducers, configureStore } from "@reduxjs/toolkit";

/**
 * Root reducer is intentionally empty for now — auth/feed/chat/etc.
 * slices are added in their respective modules (Module 3 onward).
 * Kept as a separate `combineReducers` call so tests can import the
 * root reducer without spinning up a full store.
 */
const rootReducer = combineReducers({});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
