let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-app',
        width: 640,
        height: 480
    },
    antialias: true,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let globalScene;
let game = new Phaser.Game(config);
let gameConsts = {
    width: 640,
    halfWidth: 320,
    height: 480,
    halfHeight: 240
};
let gameObjectsTemp = {};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseposx: 0,
    mouseposy: 0,
    prevMouseposx: 0,
    prevMouseposy: 0,
    mouseaccx: 0,
    mouseaccy: 0,
    lastmousedown: {x: 0, y: 0},
};
let gameObjects = {};
let soundList = [];
let updateFuncList = [];

function preload ()
{
    var canvas = game.canvas;
    loadImageFiles(imageFilesPreload);
}

function create ()
{
    onPreloadComplete(this);
}

function onPreloadComplete (scene)
{
    setupHand(scene);
    globalScene = scene;

    gameObjectsTemp.loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 50, "LOADING", {fontFamily: 'Times New Roman', fontSize: 38, color: '#ffffff', align: 'center'});
    gameObjectsTemp.loadingText.setOrigin(0.5, 0.5);
    gameObjectsTemp.loadingText.setDepth(1);

    gameObjectsTemp.loadingBarBacking = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    gameObjectsTemp.loadingBarBacking.alpha = 0.25;
    gameObjectsTemp.loadingBarBacking.scaleY = 3;
    gameObjectsTemp.loadingBarBacking.scaleX = 100;
    gameObjectsTemp.loadingBarBacking.setDepth(100);
    gameObjectsTemp.loadingBar = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    gameObjectsTemp.loadingBar.scaleY = 3;
    gameObjectsTemp.loadingBar.setDepth(101);

    let asdf = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel');
    asdf.scaleX = 100;
    asdf.scaleY = 100;

    scene.load.on('progress', function (value) {
        gameVars.loadAmt = value;
    });
    scene.load.on('complete', () => {
        onLoadComplete(scene);
    });

    loadAudioFiles();

    scene.load.start();
}

function loadAudioFiles() {
    for (let i in audioFiles) {
        let audioData = audioFiles[i];
        globalScene.load.audio(audioData.name, audioData.src);
    }
}

function loadImageFiles(scene, filesList) {
    for (let i in filesList) {
        let imageData = filesList[i];
        scene.load.image(imageData.name, imageData.src); 
    }
}

function onLoadComplete(scene) {
    gameObjectsTemp.loadingBg = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel');
    gameObjectsTemp.loadingBg.scaleX = 1000;
    gameObjectsTemp.loadingBg.scaleY = 1000;
    gameObjectsTemp.loadingBg.alpha = 0.5;
    initializeSounds(scene);

    scene.tweens.timeline({
        targets: [gameObjectsTemp.loadingText],
        tweens: [
            {
                alpha: 0,
                duration: 150
            }
        ]
    });
}

function onLoadAnimComplete(scene) {
    // Poof out the loading bar
    // scene.tweens.timeline({
    //     targets: [gameObjectsTemp.loadingBar, gameObjectsTemp.loadingBarBacking],
    //     tweens: [
    //         {
    //             offset: 0,
    //             scaleY: 0,
    //             ease: "Cubic.easeOut",
    //             duration: 600
    //         },
    //         {
    //             offset: 0,
    //             alpha: 0,
    //             scaleX: 800,
    //             duration: 600,
    //             onComplete: () => {
    //                 gameObjectsTemp.loadingBar.destroy();
    //                 gameObjectsTemp.loadingBarBacking.destroy();
    //             }
    //         }
    //     ]
    // });
}

function startGame(scene) {
    gameVars.gameStarted = true;
    gameObjects.scene = scene;
    setupGame(scene);
}

function initializeSounds(scene) {
    for (let i in audioFiles) {
        let audioData = audioFiles[i];
        if (soundList[audioData.name]) {
            console.warn('audio name duplicate ', audioData.name);
        }
        soundList[audioData.name] = scene.sound.add(audioData.name);
    }
}

function playSound(name, volume = 1) {
    soundList[name].volume = volume;
    soundList[name].play();
}

function setupHand(scene) {
    // gameObjects.baseTouchLayer = scene.make.image({
    //     x: 0, y: 0, key: 'whitePixel', add: true, scale: {x: 2000, y: 1000}, alpha: 0.01});
    // gameObjects.baseTouchLayer.setInteractive();
    // gameObjects.baseTouchLayer.on('pointerdown', onPointerDown, scene);
    // gameObjects.baseTouchLayer.on('pointermove', onPointerMove, scene);
    // gameObjects.baseTouchLayer.on('pointerup', onPointerUp, scene);

    gameObjects.hand = new Hand(scene);
}

function setupGame(scene) {
    // Makes everything dark except those in darkCtnr
    gameObjects.generalDarkness = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'darkBluePixel');
    gameObjects.generalDarkness.scaleX = 1000;
    gameObjects.generalDarkness.scaleY = 1000;
    gameObjects.generalDarkness.setBlendMode(Phaser.BlendModes.MULTIPLY);
    gameObjects.generalDarkness.alpha = 0;

    initGuideIndicators(scene);
    initOneTimeListeners();
}

function update(time, deltams) {
    // Assume 60 fps or 1000/16.66666. Don't handle below 12 FPS.
    let progressAmt = Math.min(5, deltams / 16.666666);
    if (gameVars.skipUpdateFrame) {
        gameVars.skipUpdateFrame = false;
        return;
    }

    // Buncha custom functions to run each frame
    for (let i = 0; i < updateFuncList.length; i++) {
        updateFuncList[i](progressAmt);
    }

    // check mouse
    handleMouseUpdate(progressAmt);
    buttonManager.update();

    // loading screen code
    if (!gameVars.gameConstructed) {
        let shiftedLoadAmt = 0; // slightly fudge the loading bar
        if (gameVars.loadAmt < 0.8) {
            shiftedLoadAmt = gameVars.loadAmt * 0.6; // up to 0.45
        } else if (gameVars.loadAmt < 0.999) {
            shiftedLoadAmt = gameVars.loadAmt * 0.6 + (gameVars.loadAmt - 0.8) * 1.98;
        } else {
            shiftedLoadAmt = gameVars.loadAmt;
        }

        let loadDiff = shiftedLoadAmt * gameObjectsTemp.loadingBarBacking.scaleX - gameObjectsTemp.loadingBar.scaleX;
        if (gameVars.loadAmt === 1) {
            loadDiff += 12;
        }
        gameObjectsTemp.loadingBar.scaleX = Math.min(gameObjectsTemp.loadingBarBacking.scaleX, 
            gameObjectsTemp.loadingBar.scaleX + loadDiff * 0.05);
        if (gameObjectsTemp.loadingBar.scaleX >= gameObjectsTemp.loadingBarBacking.scaleX && !gameVars.loadAnimComplete) {
            gameVars.loadAnimComplete = true;
            onLoadAnimComplete(this);
        }
    
        return;
    }
}

function handleMouseUpdate(progressAmt) {
    gameVars.mouseaccx = gameVars.mouseposx - gameVars.prevMouseposx;
    gameVars.mouseaccy = gameVars.mouseposy - gameVars.prevMouseposy;
    gameVars.prevMouseposx = gameVars.mouseposx;
    gameVars.prevMouseposy = gameVars.mouseposy;
    gameObjects.hand.update(progressAmt);
}

// Converts position of mouse into position of hand
function mouseToHand(x, y) {
    let bufferDist = 10;
    let mouseDistFromCenterX = gameConsts.halfWidth - x;
    let mouseDistFromCenterY = gameConsts.halfHeight - y;
    let xRatio = gameConsts.halfWidth / (gameConsts.halfWidth - bufferDist);
    let yRatio = gameConsts.halfHeight / (gameConsts.halfHeight - bufferDist);
    let handX = gameConsts.halfWidth + xRatio * (x - gameConsts.halfWidth);
    let handY = gameConsts.halfHeight + yRatio * (y - gameConsts.halfHeight);
    handX = Math.min(Math.max(0, handX), gameConsts.width - 1);
    handY = Math.min(Math.max(0, handY), gameConsts.height - 1);
    return {x: handX, y: handY};
}
