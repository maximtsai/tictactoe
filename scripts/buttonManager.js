class InternalButtonManager {
    constructor() {
        this.buttonList = [];
        this.lastClickedButton = null;
    }

    update() {
        let handX = gameObjects.hand.getPosX();
        let handY = gameObjects.hand.getPosY();
        // check hovering
        let hasHovered = false;
        let currentHovered = null;

        for (let i = this.buttonList.length - 1; i >= 0; i--) {
            let buttonObj = this.buttonList[i];
            if (buttonObj && buttonObj.checkCoordOver(handX, handY)) {
                buttonObj.onHover();
                hasHovered = true;
                currentHovered = buttonObj;
                break;
            }
        }
        if (gameObjectsTemp.lastHovered && gameObjectsTemp.lastHovered !== currentHovered 
            && gameObjectsTemp.lastHovered.getState() !== 'disable') {
            gameObjectsTemp.lastHovered.setState('normal');
            gameObjectsTemp.lastHovered.onHoverOut();
        }
        if (gameObjectsTemp.lastHovered && !currentHovered) {
            gameObjects.hand.setPointing(false);
        } else if (!gameObjectsTemp.lastHovered && currentHovered) {
            gameObjects.hand.setPointing(true);
        }
        gameObjectsTemp.lastHovered = currentHovered;
    }

    checkButtonClicked(x, y) {
        for (let i = this.buttonList.length - 1; i >= 0; i--) {
            let buttonObj = this.buttonList[i];
            if (buttonObj.checkCoordOver(x, y)) {
                buttonObj.onMouseDown();
                this.lastClickedButton = buttonObj;
                break;
            }
        }

    }

    getLastClickedButton() {
        return this.lastClickedButton;
    }
}

buttonManager = new InternalButtonManager();
