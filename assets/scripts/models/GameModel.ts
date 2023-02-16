import { _decorator, Component, Node, Label, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property(Prefab)
    bubblePre: Prefab | null = null;

    @property(Node)
    gridViewNode: Node | null = null;

    start() {

    }
}


