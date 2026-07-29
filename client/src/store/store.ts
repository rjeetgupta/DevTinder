import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import connectionReducer from "./slices/connectionSlice";
import feedReducer from "./slices/feedSlice";
import requestReducer from "./slices/requestSlice";
import chatReducer from "./slices/chatSlice"


const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  requests: requestReducer,
  connections: connectionReducer,
  chat: chatReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
