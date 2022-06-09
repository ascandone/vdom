import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  nextId: 0,
  todos: [],
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    input: (state, { payload }) => {
      state.value = payload;
    },
    submit(state) {
      if (state.value.trim() === "") {
        return;
      }

      state.todos.push({
        text: state.value,
        id: state.nextId,
        completed: false,
      });

      state.value = "";
      state.nextId++;
    },
    toggle(state, { payload }) {
      state.todos = state.todos.map((todo) =>
        todo.id !== payload ? todo : { ...todo, completed: !todo.completed }
      );
    },
    delete_(state, { payload }) {
      state.todos = state.todos.filter((todo) => todo.id !== payload);
    },
  },
});

export const { input, submit, toggle, delete_ } = mainSlice.actions;
export default mainSlice.reducer;
