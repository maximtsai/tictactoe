function onPointerDown(pointer) {
    gameVars.mousedown = true;
    let handPos = mouseToHand(pointer.x, pointer.y);
    gameVars.mouseposx = handPos.x;
    gameVars.mouseposy = handPos.y;
    let checkX = handPos.x;
    let checkY = handPos.y;
    gameVars.lastmousedown.x = handPos.x;
    gameVars.lastmousedown.y = handPos.y;
    gameObjects.hand.setPos(handPos.x, handPos.y);

    buttonManager.checkButtonClicked(checkX, checkY);
}

function onPointerMove(pointer) {
    let handPos = mouseToHand(pointer.x, pointer.y);
    gameVars.mouseposx = handPos.x;
    gameVars.mouseposy = handPos.y;
    gameObjects.hand.setPos(handPos.x, handPos.y);
    if (gameObjects.maskImage) {
        gameObjects.maskImage.goalX = handPos.x
        gameObjects.maskImage.goalY = handPos.y;
    }
    if (gameObjects.draggedObj && gameVars.mousedown) {
        let distToLastMouseX = gameVars.mouseposx - gameVars.lastmousedown.x;
        let distToLastMouseY = gameVars.mouseposy - gameVars.lastmousedown.y;
        let distToMouseDown = Math.sqrt(distToLastMouseX*distToLastMouseX + distToLastMouseY*distToLastMouseY)
        if (distToMouseDown >= 3) {
            gameObjects.draggedObj.setPos(gameVars.mouseposx - gameVars.halfWidth, gameVars.mouseposy);
        }
    }
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

    messageBus.publish('mouseUp');
}