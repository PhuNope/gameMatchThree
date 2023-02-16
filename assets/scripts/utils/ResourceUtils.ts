import { assetManager, AudioClip, ImageAsset, Prefab, resources, SpriteFrame, Texture2D, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceUtils')
export class ResourceUtils  {
    start() {

    }
    public static loadPrefab(path, callback) {
        resources.load(path, Prefab, (err, prefab: Prefab) => {
            if (!err) {
                callback(prefab);
            }
        })
    }
    public static loadAudio(path, callback) {
        resources.load(path, AudioClip, (err, audio: AudioClip) => {
            if (!err) {
                callback(audio);
            }
        })
    }
    public static loadSprite(path, callback) {

        resources.load(path, ImageAsset, (err, imageAsset) => {
            if (!err) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                // ...
                if (!err) {
                    callback(spriteFrame);
                }
            } else {
                console.log(err);
            }
        });
    }
    public static loadDirSprite(dirPath, callback) {
        resources.loadDir(dirPath, SpriteFrame, (err, spriteFrameList: SpriteFrame[]) => {
            if (!err) {
                callback(spriteFrameList);
            }
        })
    }
    public static loadImageFromURL(remoteUrl, callback) {
        // Remote texture url with file extensions
        assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            // ...
            if (!err) {
                callback(spriteFrame);
            }
        });
    }
}


