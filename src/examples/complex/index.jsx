/** @jsx jsx */
import jsx from "../../jsx";
import { Vdom } from "../../virtual-dom";
import "../../../style.css";
import store from "./store";
import { input, submit, toggle, delete_ } from "./reducers/main";
import memo from "../../memoize-last";

function Btn({ children, ...props }) {
  return (
    <button
      {...props}
      className="shadow bg-blue-800 text-white px-2 py-2 leading-none rounded mx-1"
    >
      {children}
    </button>
  );
}

const Li = memo(({ todo }) => (
  <li>
    {todo.text} (completed: {todo.completed})
    <Btn onclick={() => store.dispatch(toggle(todo.id))}>Toggle</Btn>
    <Btn onclick={() => store.dispatch(delete_(todo.id))}>Delete</Btn>
  </li>
));

function view(state) {
  return (
    <div className="p-5">
      <form
        onsubmit={(e) => {
          e.preventDefault();
          store.dispatch(submit());
        }}
      >
        <input
          autofocus
          className="border bg-gray-100 px-2 py-1 rounded"
          type="text"
          placeholder="write something"
          value={state.value}
          oninput={(e) => {
            store.dispatch(input(e.target.value));
          }}
        />
      </form>
      <ul className="space-y-2">
        {state.todos.length === 0 ? (
          <p>No items yet</p>
        ) : (
          state.todos.map((todo) => <Li todo={todo} />)
        )}
      </ul>
    </div>
  );
}

const root = document.getElementById("app");
const vdom = new Vdom(root);

function renderApp() {
  const state = store.getState().main;
  const ui = view(state);
  vdom.render(ui);
}

renderApp();
store.subscribe(renderApp);
