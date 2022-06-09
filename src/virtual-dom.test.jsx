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

  test("simple div with text children", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(<div>hello</div>);

    expect(root.childNodes[0].childNodes[0].textContent).toEqual("hello");
  });

  test("simple div with two children", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(
      <div>
        <button></button>
        <hr />
      </div>
    );

    expect(root.childNodes[0].childNodes[0].nodeName).toEqual("BUTTON");
    expect(root.childNodes[0].childNodes[1].nodeName).toEqual("HR");
  });

  test("simple div with child with properties", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);

    vdom.render(
      <div>
        <button x={42}></button>
      </div>
    );

    expect(root.childNodes[0].childNodes[0].x).toEqual(42);
  });
});

describe("subsequent renders", () => {
  test("different string nodes", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render("first");
    vdom.render("second");

    expect(root.childNodes[0].textContent).toBe("second");
  });

  test("same node, new property", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(<div></div>);
    vdom.render(<div x={42}></div>);

    expect(root.childNodes[0].x).toEqual(42);
  });

  test("same node, removed property", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(<div x={42}></div>);
    vdom.render(<div></div>);

    expect("x" in root.childNodes[0]).toBeFalsy();
  });

  test("same node, different property value", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(<div x={42}></div>);
    vdom.render(<div x={43}></div>);

    expect(root.childNodes[0].x).toEqual(43);
  });
});
