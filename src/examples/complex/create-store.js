import { configureStore } from "@reduxjs/toolkit";
import main from "./reducers/main";

export default function createStore() {
  const store = configureStore({
    reducer: {
      main,
    },
  });

  return store;
}
