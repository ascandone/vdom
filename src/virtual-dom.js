import {
  SetProp,
  DeleteProp,
  AppendChild,
  RemoveChild,
  ReplaceWith,
} from "./patch";
const lastVdoms = new WeakMap();

export class Vdom {
  _patches = [];

  constructor(node) {
    this._root = node;
  }

  // pre: lastVdom.nodeName === newVdom.nodeName
  _renderDiff(nodeParent, index, lastVdom, newVdom) {
    const node = nodeParent.childNodes[index];
    for (const propName in newVdom.props) {
      if (lastVdom.props[propName] !== newVdom.props[propName]) {
        this._emit(new SetProp(node, propName, newVdom.props[propName]));
      }
    }

    for (const propName in lastVdom.props) {
      if (!(propName in newVdom.props)) {
        this._emit(new DeleteProp(node, propName));
      }
    }

    const longestIndex = Math.max(
      lastVdom.children.length,
      newVdom.children.length
    );

    for (let subIndex = longestIndex; subIndex >= 0; subIndex--) {
      this._patch(
        node,
        subIndex,
        lastVdom.children[subIndex],
        newVdom.children[subIndex]
      );
    }
  }

  _emit(patch) {
    this._patches.push(patch);
  }

  _patch(nodeParent, index, lastVdom, newVdom) {
    if (lastVdom === newVdom) {
      return;
    }

    if (lastVdom === undefined && newVdom !== undefined) {
      this._emit(new AppendChild(nodeParent, newVdom));
    } else if (lastVdom !== undefined && newVdom === undefined) {
      this._emit(new RemoveChild(nodeParent, index, lastVdom.props.ondelete));
    } else if (lastVdom !== undefined && newVdom !== undefined) {
      if (
        typeof newVdom === "string" ||
        typeof lastVdom === "string" ||
        lastVdom.nodeName !== newVdom.nodeName
      ) {
        this._emit(new ReplaceWith(nodeParent, index, newVdom));
      } else {
        this._renderDiff(nodeParent, index, lastVdom, newVdom);
      }
    }
  }

  patch(newVdom) {
    const lastVdom = lastVdoms.get(this._root);
    this._patch(this._root, 0, lastVdom, newVdom);
    const ret = this._patches;
    this._patches = [];
    return ret;
  }

  render(newVdom) {
    const patches = this.patch(newVdom);
    for (const patch of patches) {
      patch.apply();
    }
    lastVdoms.set(this._root, newVdom);
  }
}
