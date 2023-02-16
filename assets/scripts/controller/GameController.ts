import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, tween, tweenUtil, Vec3 } from 'cc';
import { bubbleController } from '../objects/bubbleController';
import { GameDefines, GameState } from '../utils/GameDefines';
import { GameModel } from '../models/GameModel';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    gameModel: GameModel | null = null;

    //game grid and mode
    private _gridData = [];
    private _firstBubble: Node = null;
    private _gameScore: number;
    private _gameState: GameState;

    bubblePre: Prefab | null = null;

    gridViewNode: Node | null = null;

    onLoad() {
        this.startMatchThree();

        this.bubblePre = this.gameModel.bubblePre;
        this.gridViewNode = this.gameModel.gridViewNode;
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
            let colData: string[] = [];
            for (let row = 0; row < 5; row++) {
                colData.push(this.addBubble(col, row).uuid);
            }

            this._gridData.push(colData);
        }
    }

    public addBubble(col: number, row: number) {
        let bubbleNode = instantiate(this.bubblePre);
        this.gridViewNode.addChild(bubbleNode);
        bubbleNode.setPosition(new Vec3(col * GameDefines.spacing + GameDefines.offsetX, row * GameDefines.spacing + GameDefines.offsetY));

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
        if (this.lookForMatches().length == 0) {
            this.swapBubble(bubble1, bubble2);
        }
    }

    public swapBubble(bubble1: Node, bubble2: Node) {
        let bubble1Controller = bubble1.getComponent(bubbleController);
        let bubble2Controller = bubble2.getComponent(bubbleController);

        //swap row and col
        let tempCol = bubble1Controller.col;
        let tempRow = bubble1Controller.row;

        this._gridData[bubble1Controller.col][bubble1Controller.row] = bubble2.uuid;
        this._gridData[bubble2Controller.col][bubble2Controller.row] = bubble1.uuid;

        bubble1Controller.setColAndRow(bubble2Controller.col, bubble2Controller.row);
        bubble2Controller.setColAndRow(tempCol, tempRow);

        //swap positions
        let tempPosition = bubble1.position;
        tween(bubble1)
            .to(0.75, { position: bubble2.position }, { easing: "quadInOut" })
            .call(() => this.findAndRemoveMatches())
            .delay(0.2)
            .call(() => this.affectAbove())
            .start();

        tween(bubble2).to(0.75, { position: tempPosition }, { easing: "quadInOut" }).start();
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

    //return an array of all matches found
    public lookForMatches(): any[] {
        var matchList = [];

        //search for horizontal matches
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
                let match = this.getMatchHoriz(col, row);

                if (match.length > 2) {
                    matchList.push(match);

                    col += match.length - 1;
                }
            }
        }

        // search for vertical matches
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
                let match = this.getMatchVert(col, row);

                if (match.length > 2) {
                    matchList.push(match);

                    row += match.length - 1;
                }
            }
        }

        return matchList;
    }

    // look for horizontal matches starting at this point
    public getMatchHoriz(col: number, row: number): string[] {
        let match = [this._gridData[col][row]];

        for (let i = 1; (col + i) < 5; i++) {
            let script1 = this.gridViewNode.getChildByUuid(this._gridData[col][row]).getComponent(bubbleController);
            let script2 = this.gridViewNode.getChildByUuid(this._gridData[col + i][row]).getComponent(bubbleController);

            if (script1.type == script2.type) {
                match.push(this._gridData[col + i][row]);
            } else {
                return match;
            }
        }

        return match;
    }

    // look for vertical matches starting at this point
    public getMatchVert(col: number, row: number): string[] {
        let match = [this._gridData[col][row]];

        for (let i = 1; (row + i) < 5; i++) {
            let script1 = this.gridViewNode.getChildByUuid(this._gridData[col][row]).getComponent(bubbleController);
            let script2 = this.gridViewNode.getChildByUuid(this._gridData[col][row + i]).getComponent(bubbleController);

            if (script1.type == script2.type) {
                match.push(this._gridData[col][row + i]);
            } else {
                return match;
            }
        }

        return match;
    }

    // gets matches and removes them, applies points
    public findAndRemoveMatches() {
        //get list of matches
        let matches = this.lookForMatches();

        for (let i = 0; i < matches.length; i++) {
            //calculate point
            let numPoints: number = ((matches[i] as string[]).length - 1) * 50;

            for (let j = 0; j < (matches[i] as string[]).length; j++) {
                if (this.gridViewNode.getChildByUuid(matches[i][j])) {
                    let col = this.gridViewNode.getChildByUuid(matches[i][j]).getComponent(bubbleController).col;
                    let row = this.gridViewNode.getChildByUuid(matches[i][j]).getComponent(bubbleController).row;

                    this.gridViewNode.getChildByUuid(matches[i][j]).destroy();
                    this._gridData[col][row] = null;
                }
            }
        }
    }

    //tell all bubbles above this one to move down
    public affectAbove() {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 4; row++) {
                if (this._gridData[col][row] == null) {

                    if (this._gridData[col][row + 1] == null) continue;

                    tween(this.gridViewNode.getChildByUuid(this._gridData[col][row + 1]))

                        .to(0.25, { position: new Vec3(col * GameDefines.spacing + GameDefines.offsetX, row * GameDefines.spacing + GameDefines.offsetY) }, { easing: 'bounceInOut' })

                        .call(() => {
                            this.gridViewNode.getChildByUuid(this._gridData[col][row]).getComponent(bubbleController).row--;
                            this._gridData[col][row] = this._gridData[col][row + 1];
                            this._gridData[col][row + 1] = null;

                            row = -1;
                        })

                        .delay(0.1)

                        .call(() => {
                            this.findAndRemoveMatches();
                        })

                        .start();
                }
            }
        }
    }

    public addNewBubble(col: number) {
        
    }
}
