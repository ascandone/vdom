import { configureStore } from "@reduxjs/toolkit";
import main from "./main-slice";

export default function createStore() {
  return configureStore({
    reducer: {
      main,
    },
  });
}
