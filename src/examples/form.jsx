import { createApp } from "../create-app";

/** @jsx jsx */
import jsx from "../jsx";

const init = {
  value: "",
  nextId: 0,
  todos: [],
};

function view(state, setState) {
  function handleInput(e) {
    setState({
      value: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setState({
      value: "",
      nextId: state.nextId + 1,
      todos: state.todos.concat({
        text: state.value,
        completed: false,
        id: state.nextId,
      }),
    });
  }

  function handleToggle(id) {
    setState({
      todos: state.todos.map((todo) =>
        todo.id !== id ? todo : { ...todo, completed: !todo.completed }
      ),
    });
  }

  function handleDelete(id) {
    setState({
      todos: state.todos.filter((todo) => todo.id !== id),
    });
  }

  return (
    <div>
      <form onsubmit={handleSubmit}>
        <input
          type="text"
          placeholder="write something"
          value={state.value}
          oninput={handleInput}
        />
      </form>
      <ul>
        {state.todos.length === 0 ? (
          <p>No items yet</p>
        ) : (
          state.todos.map((todo) => (
            <li>
              {todo.text} (completed: {todo.completed})
              <button onclick={() => handleToggle(todo.id)}>Toggle</button>
              <button onclick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

createApp({
  node: "#app",
  view,
  init,
});
