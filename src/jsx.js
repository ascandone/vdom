function normalizeChild(node) {
  if (typeof node === "object" || typeof node === "string") {
    return node;
  } else {
    return node.toString();
  }
}

export default function jsx(nodeName, props, ...children) {
  return {
    nodeName,
    props: props != null ? props : {},
    children: children.map(normalizeChild),
  };
}
