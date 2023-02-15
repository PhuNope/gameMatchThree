import { Node, Vec3, tween } from "cc";
import { bubbleController } from "../items/bubbleController";

export class TweenUtil {
    public static swapBubble(gridData: any[], bubble1: Node, bubble2: Node) {
        let bubble1Controller = bubble1.getComponent(bubbleController);
        let bubble2Controller = bubble2.getComponent(bubbleController);
        //swap positions
        let tempPosition = bubble1.position;
        tween(bubble1).to(0.75, { position: bubble2.position }, { easing: "quadInOut" }).start();
        tween(bubble2).to(0.75, { position: tempPosition }, { easing: "quadInOut" }).start();

        //swap row and col
        let tempCol = bubble1Controller.col;
        let tempRow = bubble1Controller.row;

        [gridData[bubble1Controller.col][bubble1Controller.row], gridData[bubble2Controller.col][bubble2Controller.row]] = [gridData[bubble2Controller.col][bubble2Controller.row], gridData[bubble1Controller.col][bubble1Controller.row]];

        bubble1Controller.setColAndRow(bubble2Controller.col, bubble2Controller.row);
        bubble2Controller.setColAndRow(tempCol, tempRow);

        console.log(gridData);

    }
}