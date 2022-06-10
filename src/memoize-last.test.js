import { vi, expect, test } from "vitest";
import memo from "./memoize-last";

test("fn is not called initially", () => {
  const sumProps = vi.fn(({ x, y }) => x + y);
  memo(sumProps);

  expect(sumProps).not.toBeCalled();
});

test("fn is called first time and returns right result", () => {
  const sumProps = vi.fn(({ x, y }) => x + y);
  const memoized = memo(sumProps);

  const result = memoized({ x: 10, y: 20 });
  expect(sumProps).toBeCalledTimes(1);
  expect(result).toBe(30);
});

test("fn is called when last call had different args", () => {
  const sumProps = vi.fn(({ x, y }) => x + y);
  const memoized = memo(sumProps);

  memoized({ x: 10, y: 20 });
  const result = memoized({ x: 10, y: 100 });

  expect(result).toBe(110);
  expect(sumProps).toBeCalledTimes(2);
});

test("fn is not called when last call was with same args", () => {
  const sumProps = vi.fn(({ x, y }) => x + y);
  const memoized = memo(sumProps);

  memoized({ x: 10, y: 20 });
  const result = memoized({ x: 10, y: 20 });

  expect(result).toBe(30);
  expect(sumProps).toBeCalledTimes(1);
});
