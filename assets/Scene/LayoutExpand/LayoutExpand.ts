// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LayoutExpand extends cc.Layout {

    @property({
        type: cc.Node,
        visible: function () {
            return this.resizeMode == cc.Layout.ResizeMode.NONE && this.type != cc.Layout.Type.NONE;
        }
    })
    expandLayout: cc.Node = null;

    _getHorizontalBaseWidth(children) {
        var newWidth = -this.spacingX;
        let baseWid = this.node.getContentSize().width
        if (this.resizeMode === cc.Layout.ResizeMode.CONTAINER || this.expandLayout) {
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                if (child.activeInHierarchy) {
                    newWidth += child.width * this["_getUsedScaleValue"](child.scaleX) + this.spacingX + this.paddingLeft + this.paddingRight;
                    if (this.resizeMode !== cc.Layout.ResizeMode.CONTAINER && newWidth > baseWid)
                        this.pushChildInNewPar(child, this.expandLayout);
                }
            }
            if (this.resizeMode !== cc.Layout.ResizeMode.CONTAINER) {
                while (newWidth < baseWid) {
                    let child = this.expandLayout.children[0];
                    if (!child) break;
                    newWidth += child.width * this["_getUsedScaleValue"](child.scaleX) + this.spacingX + this.paddingLeft + this.paddingRight;
                    if (newWidth > baseWid) break;
                    this.pushChildInNewPar(child, this.node);
                }
                newWidth = baseWid;
            }
        } else {
            newWidth = baseWid;
        }
        return newWidth;
    }

    _getVerticalBaseHeight(children) {
        var newHeight = -this.spacingY;
        let baseHei = this.node.getContentSize().height;

        if (this.resizeMode === cc.Layout.ResizeMode.CONTAINER || this.expandLayout) {
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                if (child.activeInHierarchy) {
                    newHeight += child.height * this["_getUsedScaleValue"](child.scaleY) + this.spacingY + this.paddingBottom + this.paddingTop;
                    if (this.resizeMode !== cc.Layout.ResizeMode.CONTAINER && newHeight > baseHei)
                        this.pushChildInNewPar(child, this.expandLayout);
                }
            }
            if (this.resizeMode !== cc.Layout.ResizeMode.CONTAINER) {
                while (newHeight < baseHei) {
                    let child = this.expandLayout.children[0];
                    if (!child) break;
                    newHeight += child.height * this["_getUsedScaleValue"](child.scaleY) + this.spacingY + this.paddingBottom + this.paddingTop;
                    if (newHeight > baseHei) break;
                    this.pushChildInNewPar(child, this.node);
                }
                newHeight = baseHei;
            }
        } else {
            newHeight = baseHei;
        }
        return newHeight;
    }

    pushChildInNewPar(node: cc.Node, par: cc.Node) {
        node.parent = par;
        node.setPosition(0, 0);
    }
}
