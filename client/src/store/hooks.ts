import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import type { AppDispatch, RootState } from "./store";

/** Typed replacement for plain `useDispatch` — always use this in components. */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed replacement for plain `useSelector` — always use this in components. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
