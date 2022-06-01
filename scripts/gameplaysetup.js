function createMenu(scene) {
    globalGameObjects.startButton = new Button(
        scene,
        () => {
            destroyMenu(scene);
            createTicTacToeBoard(scene);
            playSound('button');
        },
        {
            "ref": "startGame",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight - 60
        },
        {
            "ref": "startGameHover",
            "atlas": "gameSprites"
        },
        {
            "ref": "startGamePress",
            "atlas": "gameSprites"
        }
    );

    globalGameObjects.creditsButton = new Button(
        scene,
        onCreditsButtonClicked,
        {
            "ref": "credits",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight + 30
        },
        {
            "ref": "creditsHover",
            "atlas": "gameSprites"
        },
        {
            "ref": "creditsPress",
            "atlas": "gameSprites"
        }
    );

    globalGameObjects.creditsText = scene.add.text(gameConsts.halfWidth, gameConsts.height - 80, 'Game By Maxim Tsai\nMade for Boom Entertainment', 
        {fontFamily: 'Times New Roman', fontSize: 24, color: '#000000', align: 'center'});
    globalGameObjects.creditsText.setOrigin(0.5, 0.5);
    globalGameObjects.creditsText.visible = false;
}

function destroyMenu(scene) {
    globalGameObjects.startButton.destroy();
    globalGameObjects.creditsButton.destroy();
    globalGameObjects.creditsText.destroy();
}

function createTicTacToeBoard(scene) {
    globalGameObjects.board = new Board(scene, gameConsts.halfWidth, gameConsts.halfHeight - 20);
}

function onCreditsButtonClicked() {
    globalGameObjects.creditsText.visible = true;
    playSound('button');
}