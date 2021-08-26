
const { ccclass, property } = cc._decorator;

let AnimationType = cc.Enum({
    /** 中心往四周 */
    Center2Around: 0,
    /** 四周往中心 */
    Around2Center: 1,
})

@ccclass
export default class WindowShades extends cc.Component {
    @property({ type: cc.Node, tooltip: "需要隐藏的节点" })
    public hideNode: cc.Node = null;

    @property({ displayName: "翻转时间", tooltip: "方块翻转的时间" })
    flipTime: number = 0.2;
    @property({ displayName: "间隔时间", tooltip: "每行/列的间隔时间" })
    unitTime: number = 0.1;

    @property({ type: AnimationType, displayName: "动画类型" })
    animationType = AnimationType.Center2Around;

    start() {
        this.startShades();
    }

    startShades() {
        let spriteFrame = this.cameraShot();
        this.scheduleOnce(() => {
            this.hideNode.active = false;
            this.setBlocks(spriteFrame);
        }, 2)
    }

    /**
     * 根据边长创建多个块 每个块显示spt的一部分
     * @param spt 
     * @param side 
     */
    setBlocks(spt: cc.SpriteFrame, side: number = 100) {
        let texture2d = spt.getTexture();
        if (side > texture2d.width || side > texture2d.height) {
            return;
        }

        let row = texture2d.width / side;
        let col = texture2d.height / side;
        row = Math.floor(row + (row % 1 != 0 ? (Math.floor(row) % 2 == 0 ? 1 : 2) : 0));
        col = Math.floor(col + (col % 1 != 0 ? (Math.floor(col) % 2 == 0 ? 1 : 2) : 0));

        const boardX = (texture2d.width - side * (row - 2)) / 2;
        const boardY = (texture2d.height - side * (col - 2)) / 2;

        let startX = boardX;
        let startY = boardY;

        let blockPar = new cc.Node();

        this.node.addChild(blockPar);
        let x = -texture2d.width / 2;
        for (let i = 0; i < row; i++) {
            let y = -texture2d.height / 2;
            startY = boardY;
            let width = i == 0 || i == row - 1 ? boardX : side;
            let height = side;
            x += width / 2;
            for (let j = 0; j < col; j++) {
                height = j == 0 || j == col - 1 ? boardY : side;
                y += height / 2;

                let node = new cc.Node();
                const sprite = node.addComponent(cc.Sprite);
                let newspt = new cc.SpriteFrame(texture2d, cc.rect(startX - boardX, startY - boardY, width, height));
                sprite.spriteFrame = newspt;
                node.scaleY = -1;
                node.scaleX = 1;
                blockPar.addChild(node);
                node.setPosition(x, y);
                y += height / 2;
                startY += height;
                // this.runAni1(node, i, j, row, col);
                // this.runAni2(node, i, j, row, col);

                this.startAnimation(node, i, j, row, col);
            }
            x += width / 2;
            startX += width;
        }
        this.scheduleOnce(() => {
            blockPar.destroy();
        }, Math.max(row, col) * this.unitTime + this.flipTime);
    }

    startAnimation(node, i, j, row, col) {
        switch (this.animationType) {
            case AnimationType.Center2Around:
                this.runAni1(node, i, j, row, col); break;
            case AnimationType.Around2Center:
                this.runAni2(node, i, j, row, col); break;

        }
    }

    cameraShot() {
        let camera = this.node.addComponent(cc.Camera);
        camera.cullingMask = 0xffffffff;
        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height);
        camera.targetTexture = texture;

        camera.render();
        this.scheduleOnce(() => {
            this.node.removeComponent(cc.Camera);
        })
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        return spriteFrame;
    }

    /** 从中心->四周 */
    runAni1(node: cc.Node, i, j, row, col) {
        cc.tween(node).then(cc.sequence(
            cc.delayTime((Math.abs(i - Math.floor(row / 2)) + Math.abs(j - Math.floor(col / 2))) * this.unitTime),
            cc.spawn(
                cc.scaleTo(this.flipTime, 0, -1),
                cc.fadeOut(this.flipTime * 1.1),
            ),
            cc.callFunc(() => {
                node.destroy();
            })
        )).start();
    }

    /** 从四个角->中心 */
    runAni2(node: cc.Node, i, j, row, col) {
        row = Math.floor(row / 2);
        col = Math.floor(col / 2);
        cc.tween(node).then(cc.sequence(
            cc.delayTime(
                (Math.abs(Math.abs(i - row) - row) + Math.abs(Math.abs(j - col) - col)) * this.unitTime),
            cc.spawn(
                cc.scaleTo(this.flipTime, 0, -1),
                cc.fadeOut(this.flipTime * 1.1),
            ),
            cc.callFunc(() => {
                node.destroy();
            })
        )).start();
    }
    // update (dt) {}
}
