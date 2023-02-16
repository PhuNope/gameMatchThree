import { _decorator, Component, Node, ProgressBar, director, Scene, SceneAsset } from 'cc';
import { Configs } from '../utils/Configs';

const { ccclass, property } = _decorator;

@ccclass('loading')
export class loading extends Component {
    @property(ProgressBar)
    loadingProgressBar: ProgressBar;
    start() {
        director.preloadScene(Configs.GAME_SCENE_NAME, (completedCount, totalCount) => {
            let percent = completedCount / totalCount;
            this.loadingProgressBar.progress = percent;
        },
            () => {
                //completed
                director.loadScene(Configs.GAME_SCENE_NAME);
            });
    }

}


