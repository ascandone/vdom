import { test, expect, describe } from "vitest";

/** @jsx jsx */
import jsx from "./jsx";

test("misc", () => {
  const node = (
    <div>
      <hr />
      <button>Click me</button>
      {42}
    </div>
  );

  expect(node).toEqual({
    nodeName: "div",
    props: {},
    children: [
      { nodeName: "hr", props: {}, children: [] },
      { nodeName: "button", props: {}, children: ["Click me"] },
      "42",
    ],
  });
});

test("array as children", () => {
  const node = (
    <ul>
      {[<li>1</li>, <li>2</li>]}
      <li>3</li>
    </ul>
  );

  expect(node).toEqual({
    nodeName: "ul",
    props: {},
    children: [
      { nodeName: "li", props: {}, children: ["1"] },
      { nodeName: "li", props: {}, children: ["2"] },
      { nodeName: "li", props: {}, children: ["3"] },
    ],
  });
});

test("components", () => {
  const Li = ({ children, id }) => <li id={id}>{children}</li>;

  const node = (
    <ul>
      <Li>1</Li>
      <Li>2</Li>
      <Li>3</Li>
    </ul>
  );

  expect(node).toEqual({
    nodeName: "ul",
    props: {},
    children: [
      { nodeName: "li", props: {}, children: ["1"] },
      { nodeName: "li", props: {}, children: ["2"] },
      { nodeName: "li", props: {}, children: ["3"] },
    ],
  });
});
