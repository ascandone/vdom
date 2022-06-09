function normalizeChild(node) {
  if (node === null || node === undefined) {
    return "";
  } else if (typeof node === "object" || typeof node === "string") {
    if (typeof node?.nodeName === "function") {
      return node.nodeName({ ...node.props, children: node.children });
    }
    return node;
  } else {
    return node.toString();
  }
}

export default function jsx(nodeName, props, ...children) {
  return {
    nodeName,
    props: props != null ? props : {},
    children: children.flat().map(normalizeChild),
  };
}
