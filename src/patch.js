const specialprops = ["oncreate", "ondelete"];

export class SetProp {
  constructor(node, propName, newValue) {
    this.node = node;
    this.propName = propName;
    this.newValue = newValue;
  }

  apply() {
    this.node[this.propName] = this.newValue;
  }
}

export class DeleteProp {
  constructor(node, propName) {
    this.node = node;
    this.propName = propName;
  }

  apply() {
    delete this.node[this.propName];
  }
}

export class AppendChild {
  constructor(nodeParent, newVdom) {
    this.nodeParent = nodeParent;
    this.newVdom = newVdom;
  }
  apply() {
    const node = createNode(this.newVdom);
    this.nodeParent.appendChild(node);
  }
}

export class RemoveChild {
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

export class ReplaceWith {
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
