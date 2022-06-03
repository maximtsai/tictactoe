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
    setupLoadingBar(scene);

    loadFileList(scene, audioFiles, 'audio');
    loadFileList(scene, imageFiles, 'atlas');

    scene.load.start();
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    createMenu(scene);
}

function update() {
    // check mouse
    buttonManager.update();
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
    baseTouchLayer.on('pointerdown', mouseManager.onPointerDown, scene);
    baseTouchLayer.on('pointermove', mouseManager.onPointerMove, scene);
    baseTouchLayer.on('pointerup', mouseManager.onPointerUp, scene);
}