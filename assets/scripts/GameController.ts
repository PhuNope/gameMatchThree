import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, tween } from 'cc';
import { bubbleController } from './items/bubbleController';
import { GameState } from './utils/GameDefines';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    //game grid and mode
    private _gridData = [];
    private _firstBubble: Node = null;
    private _gameScore: number;
    private _gameState: GameState;

    @property(Prefab)
    bubblePre: Prefab | null = null;

    @property(Node)
    gridViewNode: Node | null = null;

    onLoad() {
        this.startMatchThree();
    }

    start() {
        this.setUpGrid();
    }

    //set up grid and startgame
    public startMatchThree() {
        this._gameScore = 0;
        this._gameState = GameState.PLAYING;
    }

    public setUpGrid() {

        for (let col = 0; col < 5; col++) {
            let colData: Node[] = [];
            for (let row = 0; row < 5; row++) {
                colData.push(this.addBubble(col, row));
            }

            this._gridData.push(colData);
        }

        console.log(this._gridData);

    }

    public addBubble(col: number, row: number) {
        let bubbleNode = instantiate(this.bubblePre);
        this.gridViewNode.addChild(bubbleNode);

        //random sprite frame;
        let bubbleNodeController = bubbleNode.getComponent(bubbleController);
        bubbleNodeController.setType();
        bubbleNodeController.setColAndRow(col, row);
        bubbleNodeController.addEventListener("clickPiece", (bubbleNodeTarget: Node) => this.clickPiece(bubbleNodeTarget));

        return bubbleNode;
    }

    public clickPiece(bubbleNodeTarget: Node) {
        let bubbleTargetController = bubbleNodeTarget.getComponent(bubbleController);
        // first one selected
        if (!this._firstBubble) {
            bubbleTargetController.setVisible(true);
            this._firstBubble = bubbleNodeTarget;
        }
        // clicked on bubble piece again
        else if (this._firstBubble == bubbleNodeTarget) {
            bubbleTargetController.setVisible(false);
            this._firstBubble = null;
        }
        //clicked second bubble
        else {
            let bubbleFirstController = this._firstBubble.getComponent(bubbleController);
            bubbleFirstController.setVisible(false);

            //same row, one column over
            if (bubbleFirstController.row == bubbleTargetController.row && Math.abs(bubbleFirstController.col - bubbleTargetController.col) == 1) {
                this.makeSwap(this._firstBubble, bubbleNodeTarget);
                this._firstBubble = null;
            }
            //same column, one row over
            else if (bubbleFirstController.col == bubbleTargetController.col && Math.abs(bubbleFirstController.row - bubbleTargetController.row) == 1) {
                this.makeSwap(this._firstBubble, bubbleNodeTarget);
                this._firstBubble = null;
            }
            //bad move, reassign first bubble
            else {
                this._firstBubble = bubbleNodeTarget;
                this._firstBubble.getComponent(bubbleController).setVisible(true);
            }
        }
    }

    // start animated swap of two bubbles
    public makeSwap(bubble1: Node, bubble2: Node) {
        this._gameState = GameState.SWAPPING;
        this.swapBubble(bubble1, bubble2);

        // check to see if move was fruitful        
    }

    public swapBubble(bubble1: Node, bubble2: Node) {
        let bubble1Controller = bubble1.getComponent(bubbleController);
        let bubble2Controller = bubble2.getComponent(bubbleController);
        //swap positions
        let tempPosition = bubble1.position;
        tween(bubble1).to(0.75, { position: bubble2.position }, { easing: "quadInOut" }).start();
        tween(bubble2).to(0.75, { position: tempPosition }, { easing: "quadInOut" }).start();

        //swap row and col
        let tempCol = bubble1Controller.col;
        let tempRow = bubble1Controller.row;

        [this._gridData[bubble1Controller.col][bubble1Controller.row], this._gridData[bubble2Controller.col][bubble2Controller.row]] = [this._gridData[bubble2Controller.col][bubble2Controller.row], this._gridData[bubble1Controller.col][bubble1Controller.row]];

        bubble1Controller.setColAndRow(bubble2Controller.col, bubble2Controller.row);
        bubble2Controller.setColAndRow(tempCol, tempRow);

        console.log(this._gridData);

    }

    // public moveBubble() {
    //     let madeMove: boolean = false;

    //     for (let row = 0; row < 5; row++) {
    //         for (let col = 0; col < 5; col++) {
    //             if (this._gridData[col][row]) {
    //                 let dataController: bubbleController = this._gridData[col][row].getComponent(bubbleController);
    //                 //needs to move down
    //                 if (dataController.col) {

    //                 }
    //             }
    //         }

    //     }
    // }

    
}


