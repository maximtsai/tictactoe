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

let game = new Phaser.Game(config);
let gameConsts = {
    width: 640,
    halfWidth: 320,
    height: 480,
    halfHeight: 240
};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseposx: 0,
    mouseposy: 0,
    lastmousedown: {x: 0, y: 0},
};
let globalGameObjects = {};
let soundList = [];
let updateFuncList = [];

function preload ()
{
    var canvas = game.canvas;
    loadFileList(this, imageFilesPreload, 'image');
}

function create ()
{
    onPreloadComplete(this);
}

function onPreloadComplete (scene)
{
    setupMouseInteraction(scene);

    let loadingBarBacking = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    loadingBarBacking.alpha = 0.25;
    loadingBarBacking.scaleY = 3;
    loadingBarBacking.scaleX = 100;
    loadingBarBacking.setDepth(100);
    let loadingBar = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    loadingBar.scaleY = 3;
    loadingBar.setDepth(101);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        loadingBar.scaleX = value * loadingBarBacking.scaleX;
    });
    scene.load.on('complete', () => {
        onLoadComplete(scene);
        // Animate out the loading bar
        scene.tweens.add({
            targets: [loadingBar, loadingBarBacking],
            scaleX: loadingBar.scaleX * 2,
            scaleY: 0,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                loadingBar.destroy();
            }
        });
    });

    loadFileList(scene, audioFiles, 'audio');
    loadFileList(scene, imageFiles, 'atlas');

    scene.load.start();
}

function loadFileList(scene, filesList, type) {
    for (let i in filesList) {
        let data = filesList[i];
        switch (type) {
            case 'audio':
                scene.load.audio(data.name, data.src);
            break;
            case 'image':
                scene.load.image(data.name, data.src);
            break;
            case 'atlas':
                scene.load.multiatlas(data.name, data.src);
            break;
        }
    }
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    createMenu(scene);
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

function setupMouseInteraction(scene) {
    let baseTouchLayer = scene.make.image({
        x: 0, y: 0, key: 'whitePixel', add: true, scale: {x: 1000, y: 1000}});
    baseTouchLayer.setInteractive();
    baseTouchLayer.on('pointerdown', onPointerDown, scene);
    baseTouchLayer.on('pointermove', onPointerMove, scene);
    baseTouchLayer.on('pointerup', onPointerUp, scene);
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
    buttonManager.update();

}
