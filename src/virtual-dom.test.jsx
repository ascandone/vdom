import { test, expect, describe } from "vitest";
import { Vdom } from "./virtual-dom";
/** @jsx jsx */
import jsx from "./jsx";

describe("initial render", () => {
  test("text nodes", () => {
    const root = document.createElement("div");
    const vdom = new Vdom(root);

    vdom.render("hello");
    expect(root.childNodes[0].textContent).toBe("hello");
  });

  test("simple div", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(<div></div>);

    expect(root.childNodes[0].nodeName).toEqual("DIV");
  });

  test("simple div with number property", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(<div x={42}></div>);

    expect(root.childNodes[0]["x"]).toEqual(42);
  });

  test("simple div with id attribute", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(<div id="my-id"></div>);

    expect(root.childNodes[0].getAttribute("id")).toEqual("my-id");
  });
});
