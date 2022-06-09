import { test, expect, describe } from "vitest";

/** @jsx jsx */
import jsx from "./jsx";

test("misc", () => {
  const node = (
    <div>
      <hr />
      <button>Click me</button>
    </div>
  );

  expect(node).toEqual({
    nodeName: "div",
    props: {},
    children: [
      { nodeName: "hr", props: {}, children: [] },
      { nodeName: "button", props: {}, children: ["Click me"] },
    ],
  });
});
