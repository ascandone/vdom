import {
  SetProp,
  DeleteProp,
  AppendChild,
  RemoveChild,
  ReplaceWith,
} from "./patch";
const lastVdoms = new WeakMap();

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
