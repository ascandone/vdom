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

  // pre: lastVdom.nodeName === newVdom.nodeName
  _renderDiff(nodeParent, index, lastVdom, newVdom) {
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

    const longestIndex = Math.max(
      lastVdom.children.length,
      newVdom.children.length
    );

    for (let subIndex = longestIndex; subIndex >= 0; subIndex--) {
      this._renderRec(
        node,
        subIndex,
        lastVdom.children[subIndex],
        newVdom.children[subIndex]
      );
    }
  }

  _renderRec(nodeParent, index, lastVdom, newVdom) {
    if (lastVdom === newVdom) {
      return;
    }

    // Creating new node
    if (lastVdom === undefined && newVdom !== undefined) {
      const node = Vdom._newNode(newVdom);
      nodeParent.appendChild(node);
    } else if (lastVdom !== undefined && newVdom === undefined) {
      nodeParent.removeChild(nodeParent.childNodes[index]);
    } else if (lastVdom !== undefined && newVdom !== undefined) {
      if (
        typeof newVdom === "string" ||
        typeof lastVdom === "string" ||
        lastVdom.nodeName !== newVdom.nodeName
      ) {
        const node = Vdom._newNode(newVdom);
        nodeParent.childNodes[index].replaceWith(node);
      } else {
        this._renderDiff(nodeParent, index, lastVdom, newVdom);
      }
    }
  }

  render(newVdom) {
    this._renderRec(this._root, 0, this._lastVdom, newVdom);
    this._lastVdom = newVdom;
  }
}
