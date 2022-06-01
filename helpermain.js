function addToUpdateFuncList(func) {
    if (func) {
        updateFuncList.push(func);
    } else {
        console.warn("invalid function added");
    }
}

function removeFromUpdateFuncList(func) {
    let indexToRemove = updateFuncList.indexOf(func);
    if (indexToRemove > -1) {
        updateFuncList.splice(indexToRemove, 1);
    }
}

function zoomTemp(zoomAmt) {
    globalScene.cameras.main.setZoom(zoomAmt);
    globalScene.tweens.add({
        targets: globalScene.cameras.main,
        zoom: 1,
        ease: "Cubic.easeOut",
        duration: 400
    });
}

function addScreenShake(x, y) {
    globalScene.cameras.main.x += x;
    globalScene.cameras.main.y += x;
}
