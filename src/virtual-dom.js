export class Vdom {
  _lastVdom = undefined;

  constructor(node) {
    this._root = node;
  }

  _createNode(nodeParent, newVdom) {
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

      for (let newIndex = 0; newIndex < newVdom.children.length; newIndex++) {
        this._renderRec(node, newIndex, undefined, newVdom.children[newIndex]);
      }

      // ##PATCH
      nodeParent.appendChild(node);
    }
  }

  _renderRec(nodeParent, index, lastVdom, newVdom) {
    // Creating new node
    if (lastVdom === undefined && newVdom !== undefined) {
      this._createNode(nodeParent, newVdom);
    } else if (lastVdom !== undefined && newVdom !== undefined) {
      if (typeof lastVdom === "string" && typeof newVdom === "string") {
        // ##PATCH
        nodeParent.childNodes[index].textContent = newVdom;
      } else if (typeof lastVdom === "string" && typeof newVdom !== "string") {
        throw new Error("TODO from string node to regular node");
      } else if (typeof lastVdom !== "string" && typeof newVdom === "string") {
        throw new Error("TODO from regular node to string node");
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
        throw new Error("TODO diffing different node");
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
