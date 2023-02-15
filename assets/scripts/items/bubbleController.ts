import { _decorator, Component, Sprite, SpriteFrame, Node, Input, randomRangeInt } from 'cc';
import { GameController } from '../GameController';
const { ccclass, property } = _decorator;

@ccclass('bubbleController')

export class bubbleController extends Component {
    @property(SpriteFrame)
    bubblesSF: SpriteFrame[] = [];

    @property(Node)
    background: Node | null = null;

    @property(Sprite)
    displaySpriteFrame: Sprite | null = null;

    public col: number;
    public row: number;
    public type: number;

    //callback
    private _clickPiece: CallableFunction;

    onLoad() {
        this.background.active = false;
    }

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.clickPiece, this);
    }

    setDisplaySpriteFrame(index: number): void {
        this.type = index;

        this.displaySpriteFrame.spriteFrame = this.bubblesSF[index];
    }

    public setType() {
        this.type = randomRangeInt(0, this.bubblesSF.length);

        this.displaySpriteFrame.spriteFrame = this.bubblesSF[this.type];
    }

    public setColAndRow(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

    public setVisible(state: boolean) {
        this.background.active = state;
    }

    public addEventListener(name: string, func: CallableFunction) {
        switch (name) {
            case "clickPiece":
                this._clickPiece = func;
                break;
        }
    }

    clickPiece() {
        this._clickPiece(this.node);
    }
}



