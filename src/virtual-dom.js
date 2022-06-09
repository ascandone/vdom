export class Vdom {
  _lastVdom = undefined;

  constructor(node) {
    this._root = node;
  }

  _renderRec(nodeParent, index, lastVdom, newVdom) {
    // Creating new node
    if (lastVdom === undefined && newVdom !== undefined) {
      if (typeof newVdom === "string") {
        // text node
        const strNode = document.createTextNode(newVdom);

        // ##PATCH
        nodeParent.appendChild(strNode);
      } else {
        // regular node
        const node = document.createElement(newVdom.nodeName);

        for (const propName in newVdom.props) {
          // ##PATCH
          node[propName] = newVdom.props[propName];
        }

        // ##PATCH
        nodeParent.appendChild(node);
      }
    }
  }

  render(newVdom) {
    this._renderRec(this._root, 0, this._lastVdom, newVdom);
    this._lastVdom = newVdom;
  }
}
