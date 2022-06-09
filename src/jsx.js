export default function jsx(nodeName, props, ...children) {
  return {
    nodeName,
    props: props != null ? props : {},
    children,
  };
}
