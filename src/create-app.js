import { Vdom } from "./virtual-dom";

export function createApp({ node, init, view }) {
  const root = document.querySelector(node);

  const vdom = new Vdom(root);

  let state = init;

  const setState = (newState) => {
    state = { ...state, ...newState };
    const ui = view(state, setState);
    vdom.render(ui);
  };

  const firstView = view(init, setState);
  vdom.render(firstView);
}
