const lastVdoms = new WeakMap();

const specialprops = ["oncreate", "ondelete"];

class SetProp {
  constructor(node, propName, newValue) {
    this.node = node;
    this.propName = propName;
    this.newValue = newValue;
  }

  apply() {
    this.node[this.propName] = this.newValue;
  }
}

class DeleteProp {
  constructor(node, propName) {
    this.node = node;
    this.propName = propName;
  }

  apply() {
    delete this.node[this.propName];
  }
}

class AppendChild {
  constructor(nodeParent, newVdom) {
    this.nodeParent = nodeParent;
    this.newVdom = newVdom;
  }
  apply() {
    const node = createNode(this.newVdom);
    this.nodeParent.appendChild(node);
  }
}

class RemoveChild {
  constructor(nodeParent, index, onDelete) {
    this.nodeParent = nodeParent;
    this.index = index;
    this.onDelete = onDelete;
  }

  apply() {
    if (this.onDelete) {
      this.onDelete();
    }

    this.nodeParent.removeChild(this.nodeParent.childNodes[this.index]);
  }
}

class ReplaceWith {
  constructor(nodeParent, index, newVdom) {
    this.nodeParent = nodeParent;
    this.index = index;
    this.newVdom = newVdom;
  }

  apply() {
    const node = createNode(this.newVdom);
    this.nodeParent.childNodes[this.index].replaceWith(node);
  }
}

function createNode(vdom) {
  if (typeof vdom === "string") {
    const strNode = document.createTextNode(vdom);
    return strNode;
  } else {
    const node = document.createElement(vdom.nodeName);

    for (const propName in vdom.props) {
      if (specialprops.includes(propName)) {
        continue;
      }

      // ##PATCH
      node[propName] = vdom.props[propName];
    }

    for (const vchild of vdom.children) {
      const child = createNode(vchild);
      node.appendChild(child);
    }

    if (vdom.props.oncreate) {
      vdom.props?.oncreate();
    }

    return node;
  }
}

export class Vdom {
  constructor(node) {
    this._root = node;
  }

  // pre: lastVdom.nodeName === newVdom.nodeName
  _renderDiff(nodeParent, index, lastVdom, newVdom) {
    const node = nodeParent.childNodes[index];
    for (const propName in newVdom.props) {
      if (lastVdom.props[propName] !== newVdom.props[propName]) {
        new SetProp(node, propName, newVdom.props[propName]).apply();
      }
    }

    for (const propName in lastVdom.props) {
      if (!(propName in newVdom.props)) {
        new DeleteProp(node, propName).apply();
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

    if (lastVdom === undefined && newVdom !== undefined) {
      new AppendChild(nodeParent, newVdom).apply();
    } else if (lastVdom !== undefined && newVdom === undefined) {
      new RemoveChild(nodeParent, index, lastVdom.props.ondelete).apply();
    } else if (lastVdom !== undefined && newVdom !== undefined) {
      if (
        typeof newVdom === "string" ||
        typeof lastVdom === "string" ||
        lastVdom.nodeName !== newVdom.nodeName
      ) {
        new ReplaceWith(nodeParent, index, newVdom).apply();
      } else {
        this._renderDiff(nodeParent, index, lastVdom, newVdom);
      }
    }
  }

  render(newVdom) {
    const lastVdom = lastVdoms.get(this._root);
    this._renderRec(this._root, 0, lastVdom, newVdom);
    lastVdoms.set(this._root, newVdom);
  }
}
