export class Vdom {
  _lastVdom = undefined;

  constructor(node) {
    this._root = node;
  }

  static _newNode(vdom) {
    if (typeof vdom === "string") {
      const strNode = document.createTextNode(vdom);
      return strNode;
    } else {
      const node = document.createElement(vdom.nodeName);

      for (const propName in vdom.props) {
        // ##PATCH
        node[propName] = vdom.props[propName];
      }

      for (const vchild of vdom.children) {
        const child = Vdom._newNode(vchild);
        node.appendChild(child);
      }

      return node;
    }
  }

  _renderRec(nodeParent, index, lastVdom, newVdom) {
    // Creating new node
    if (lastVdom === undefined && newVdom !== undefined) {
      const node = Vdom._newNode(newVdom);
      nodeParent.appendChild(node);
    } else if (lastVdom !== undefined && newVdom !== undefined) {
      if (typeof newVdom === "string") {
        // ##PATCH
        nodeParent.childNodes[index].textContent = newVdom;
      } else if (typeof lastVdom === "string" && typeof newVdom !== "string") {
        const node = Vdom._newNode(newVdom);
        nodeParent.childNodes[index] = node;
      } else if (lastVdom.nodeName === newVdom.nodeName) {
        const node = nodeParent.childNodes[index];
        for (const propName in newVdom.props) {
          // ##PATCH
          if (lastVdom.props[propName] !== newVdom.props[propName]) {
            node[propName] = newVdom.props[propName];
          }
        }

        for (const propName in lastVdom.props) {
          // ##PATCH
          if (!(propName in newVdom.props)) {
            delete node[propName];
          }
        }
      } else {
        const node = Vdom._newNode(newVdom);
        nodeParent.childNodes[index] = node;
      }
    } else if (lastVdom !== undefined && newVdom === undefined) {
      throw new Error("TODO removing node");
    }
  }

  render(newVdom) {
    this._renderRec(this._root, 0, this._lastVdom, newVdom);
    this._lastVdom = newVdom;
  }
}
