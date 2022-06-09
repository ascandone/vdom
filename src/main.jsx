import { createApp } from "./create-app";
/** @jsx jsx */
import jsx from "./jsx";

function view(state, setState) {
  function handleIncrement() {
    setState({ count: state.count + 1 });
  }

  return (
    <div>
      <p>
        Hello! Count is <span>{state.count}</span>
      </p>
      <button onclick={handleIncrement}>Increment</button>
    </div>
  );
}

createApp({
  node: "#app",
  init: { count: 0 },
  view,
});
