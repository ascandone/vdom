import { test, expect, describe, vi } from "vitest";
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

  test("from regular node to string node", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(<div>hello world</div>);
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
    vdom.render(<div x={44}></div>);

    expect(root.childNodes[0].x).toEqual(44);
  });

  test("from text node to regular node", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render("first");
    vdom.render(<div x={43}></div>);

    expect(root.childNodes[0].nodeName).toEqual("DIV");
    expect(root.childNodes[0].x).toEqual(43);
  });

  test("two different nodes", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(<div x={100}></div>);
    vdom.render(<button y={200}></button>);

    expect(root.childNodes[0].nodeName).toEqual("BUTTON");
    expect("x" in root.childNodes[0]).toBeFalsy();
    expect(root.childNodes[0].y).toEqual(200);
  });
});

describe("diffing children", () => {
  test("removing the only child", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(
      <ul>
        <li>first child</li>
      </ul>
    );

    vdom.render(<ul></ul>);

    expect(root.childNodes[0].childNodes.length).toEqual(0);
  });

  test("removing two children", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(
      <ul>
        <li>first child</li>
        <li>second child</li>
      </ul>
    );

    vdom.render(<ul></ul>);

    expect(root.childNodes[0].childNodes.length).toEqual(0);
  });

  test("removing a middle child", () => {
    const root = document.createElement("div");

    const vdom = new Vdom(root);
    vdom.render(
      <ul>
        <li id="0">first child</li>
        <li id="1">second child</li>
        <li id="2">third child</li>
      </ul>
    );

    vdom.render(
      <ul>
        <li id="0">first child</li>
        <li id="2">third child</li>
      </ul>
    );

    expect(root.childNodes[0].childNodes.length).toEqual(2);
    expect(root.childNodes[0].childNodes[0].id).toEqual("0");
    expect(root.childNodes[0].childNodes[1].id).toEqual("2");
  });
});

describe("event listeners", () => {
  test("click on btn", () => {
    const root = document.createElement("div");

    const onClick = vi.fn();

    const vdom = new Vdom(root);
    vdom.render(<button onclick={onClick}></button>);
    root.childNodes[0].click();

    expect(onClick).toBeCalledTimes(1);
  });

  test("click on btn (subsequent renders)", () => {
    const root = document.createElement("div");

    const onClick = vi.fn();
    const onClick2 = vi.fn();

    const vdom = new Vdom(root);
    vdom.render(<button onclick={onClick}></button>);
    vdom.render(<button onclick={onClick2}></button>);

    root.childNodes[0].click();
    expect(onClick).toBeCalledTimes(0);
    expect(onClick2).toBeCalledTimes(1);
  });
});
