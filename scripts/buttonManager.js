class InternalButtonManager {
    constructor() {
        this.buttonList = [];
        this.lastHovered = null;
        this.lastClickedButton = null;
    }

    update() {
        let handX = gameVars.mouseposx;
        let handY = gameVars.mouseposy;
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
        if (this.lastHovered && this.lastHovered !== currentHovered 
            && this.lastHovered.getState() !== 'disable') {
            this.lastHovered.setState('normal');
            this.lastHovered.onHoverOut();
        }

        this.lastHovered = currentHovered;
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

    addToButtonList(button) {
        this.buttonList.push(button);
    }

    getLastClickedButton() {
        return this.lastClickedButton;
    }

    removeButton(button) {
        for (let i in this.buttonList) {
            if (this.buttonList[i] === button) {
                this.buttonList.splice(parseInt(i), 1);
                break;
            }
        }
    }
}

buttonManager = new InternalButtonManager();
