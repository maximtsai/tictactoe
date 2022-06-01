function onPointerDown(pointer) {
    gameVars.mousedown = true;
    let handPos = mouseToHand(pointer.x, pointer.y);
    gameVars.mouseposx = handPos.x;
    gameVars.mouseposy = handPos.y;
    let checkX = handPos.x;
    let checkY = handPos.y;
    gameVars.lastmousedown.x = handPos.x;
    gameVars.lastmousedown.y = handPos.y;

    buttonManager.checkButtonClicked(checkX, checkY);
}

function onPointerMove(pointer) {
    let handPos = mouseToHand(pointer.x, pointer.y);
    gameVars.mouseposx = handPos.x;
    gameVars.mouseposy = handPos.y;
}

function onPointerUp(pointer) {    gameVars.mousedown = false;
    let handPos = mouseToHand(pointer.x, pointer.y);
    gameVars.mouseposx = handPos.x;
    gameVars.mouseposy = handPos.y;
    let checkX = handPos.x;
    let checkY = handPos.y;
    let buttonObj = buttonManager.getLastClickedButton();
    if (buttonObj && buttonObj.checkCoordOver(checkX, checkY)) {
        buttonObj.onMouseUp();
    }
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
