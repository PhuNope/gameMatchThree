class GameDefines {
    public static spacing: number = 120;
    public static offsetX: number = 50;
    public static offsetY: number = 50;
}

enum GameState {
    PLAYING,
    DROPPING,
    SWAPPING
}

export { GameDefines, GameState };