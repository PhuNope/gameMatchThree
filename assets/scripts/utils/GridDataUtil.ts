import { Node, Vec3, tween } from "cc";
import { bubbleController } from "../objects/bubbleController";

export class GridDataUtil {
    public clearEvents(gridData: any[]) {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                let bubbleComponentController: bubbleController = gridData[col][row].getComponent(bubbleController);
                bubbleComponentController.offEventClick();
            }
        }
    }

    public setEvents(gridData: any[]) {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                let bubbleComponentController: bubbleController = gridData[col][row].getComponent(bubbleController);
                bubbleComponentController.onEventClick();
            }
        }
    }


}