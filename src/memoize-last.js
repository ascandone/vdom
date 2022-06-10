export function shallowEq(o1, o2) {
  for (const prop in o1) {
    if (o1[prop] !== o2[prop]) {
      return false;
    }
  }

  for (const prop in o2) {
    if (o1[prop] !== o2[prop]) {
      return false;
    }
  }

  return true;
}

export default function memo(f, eq = shallowEq) {
  // TODO write better
  let last = undefined;

  return (props) => {
    if (last === undefined) {
      const result = f(props);
      last = [props, result];
    }

    const [lastProps, lastResult] = last;

    if (!eq(props, lastProps)) {
      const result = f(props);
      last = [props, result];
    }

    const [, retValue] = last;
    return retValue;
  };
}
