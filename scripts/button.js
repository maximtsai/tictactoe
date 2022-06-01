const NORMAL = "normal";
const HOVER = "hover";
const PRESS = "press";
const DISABLE = "disable";
class Button {
    constructor(scene, onMouseUp, normal, hover, press, disable) {
        this.scene = scene;
        this.state = NORMAL;
        this.normal = normal;
        this.hover = hover || normal;
        this.press = press || normal;
        this.disable = disable || normal;
        this.onMouseUpFunc = onMouseUp;
        this.onHoverFunc = null;

        this.imageRefs = {};
        this.oldImageRef = null;
        this.currImageRef = null;
        gameObjects.buttonList.push(this);

        this.handlePreload();
        this.setState(NORMAL);
    }

    setState(newState) {
        let stateData;
        switch(newState) {
            case NORMAL:
                stateData = this.normal;
                break;
            case HOVER:
                stateData = this.hover;
                break;
            case PRESS:
                stateData = this.press;
                break;
            case DISABLE:
                stateData = this.disable;
                break;
            default:
                console.error("Invalid state ", newState);
                return;
        }
        this.state = newState;
        if (stateData.ref) {
            this.oldImageRef = this.currImageRef;
            this.currImageRef = stateData.ref;
            // hide old
            if (this.imageRefs[this.oldImageRef]) {
                this.imageRefs[this.oldImageRef].visible = false;
            }
            let newImage = this.imageRefs[stateData.ref];
            if (!newImage) {
                // create if doesn't exist
                if (stateData.atlas) {
                    newImage = this.scene.add.sprite(0, 0, stateData.atlas, stateData.ref);
                } else {
                    newImage = this.scene.add.sprite(0, 0, stateData.ref);
                }
                let oldImage = this.imageRefs[this.oldImageRef];
                if (oldImage) {
                    newImage.setOrigin(oldImage.originX, oldImage.originY);
                }
                this.scene.add(newImage);
                this.imageRefs[stateData.ref] = newImage;
            }
            newImage.visible = true;
        }
        let oldImage = this.imageRefs[this.oldImageRef];
        if (!oldImage) {
            // handle edge case when starting out
            oldImage = this.imageRefs[this.currImageRef];
        }
        if (stateData.x === undefined) {
            this.imageRefs[stateData.ref].x = oldImage.x || 0;
        } else {
            this.imageRefs[stateData.ref].x = stateData.x;
        }
        if (stateData.y === undefined) {
            this.imageRefs[stateData.ref].y = oldImage.y || 0;
        } else {
            this.imageRefs[stateData.ref].y = stateData.y;
        }
        if (stateData.alpha === undefined) {
            this.imageRefs[stateData.ref].alpha = oldImage.alpha || 1;
        } else {
            this.imageRefs[stateData.ref].alpha = stateData.alpha;
        }
        if (stateData.scaleX === undefined) {
            this.imageRefs[stateData.ref].scaleX = oldImage.scaleX || 1;
        } else {
            this.imageRefs[stateData.ref].scaleX = stateData.scaleX;
        }
        if (stateData.scaleY === undefined) {
            this.imageRefs[stateData.ref].scaleY = oldImage.scaleY || 1;
        } else {
            this.imageRefs[stateData.ref].scaleY = stateData.scaleY;
        }
    }

    handlePreload() {
        if (this.hover.preload) {
            this.setState(HOVER);
        }
        if (this.press.preload) {
            this.setState(PRESS);
        }
        if (this.disable.preload) {
            this.setState(DISABLE);
        }
    }

    checkCoordOver(x, y) {
        if (this.state === DISABLE) {
            return false;
        }
        let currImage = this.imageRefs[this.currImageRef];
        let width = currImage.width * Math.abs(currImage.scaleX);
        let height = currImage.height * Math.abs(currImage.scaleY);
        let leftMost = currImage.x - currImage.originX * width;
        let rightMost = currImage.x + (1 - currImage.originX) * width;
        if (x < leftMost || y > rightMost) {
            return false;
        }
        let topMost = currImage.y - currImage.originY * height;
        let botMost = currImage.y + (1 - currImage.originY) * height;
        if (yPos < topMost || yPos > botMost) {
            return false
        }
        return true;
    }

    onHover() {
        if (this.state === NORMAL) {
            this.setState(HOVER);
        }
        if (this.onHoverFunc) {
            this.onHoverFunc();
        }
    }

    onHoverOut() {
        this.setState(NORMAL);
    }

    onMouseDown() {
        if (this.state !== DISABLE) {
            this.setState(PRESS);
            if (this.onMouseDownFunc) {
                this.onMouseDownFunc();
            }
        }
    }

    onMouseUp() {
        if (this.state === PRESS) {
            this.setState(HOVER);
            if (this.onMouseUpFunc) {
                this.onMouseUpFunc();
            }
        }
    }

    getPosX() {
        return this.getXPos();
    }

    getPosY() {
        return this.getYPos();
    }

    getScaleX() {
        return this.imageRefs[this.currImageRef].scaleX;
    }

    getScaleY() {
        return this.imageRefs[this.currImageRef].scaleY;
    }

    getXPos() {
        return this.normal.x;
    }

    getYPos() {
        return this.normal.y;
    }

    getWidth() {
        return this.imageRefs[this.currImageRef].width * this.imageRefs[this.currImageRef].scaleX;
    }

    getHeight() {
        return this.imageRefs[this.currImageRef].height * this.imageRefs[this.currImageRef].scaleY;
    }

    getState() {
        return this.state;
    }

    setOnMouseDownFunc(func) {
        this.onMouseDownFunc = func;
    }

    setOnMouseUpFunc(func) {
        this.onMouseUpFunc = func;
    }

    setOnHoverFunc(func) {
        this.onHover = func;
    }

    setOnHoverOutFunc(func) {
        this.onHoverOut = func;
    }

    setNormalRef(ref) {
        this.normal.ref = ref;
        if (this.state === NORMAL) {
            this.setState(NORMAL);
        }
    }

    setHoverRef(ref) {
        this.hover.ref = ref;
        if (this.state === HOVER) {
            this.setState(HOVER);
        }
    }

    setHoverAlpha(alpha) {
        this.hover.alpha = alpha;
    }

    setPressRef(ref) {
        this.press.ref = ref;
        if (this.state === PRESS) {
            this.setState(PRESS);
        }
    }

    setDisableRef(ref) {
        this.disable.ref = ref;
        if (this.state === DISABLE) {
            this.setState(DISABLE);
        }
    }

    setAllRef(ref) {
        this.normal.ref = ref;
        this.hover.ref = ref;
        this.press.ref = ref;
        this.disable.ref = ref;
        this.setState(this.state);
    }

    setPos(x, y) {
        if (x !== undefined) {
            this.normal.x = x;
            this.hover.x = x;
            this.press.x = x;
            this.disable.x = x;
            for (let i in this.imageRefs) {
                this.imageRefs[i].x = x;
            }
        }
        if (y !== undefined) {
            this.normal.y = y;
            this.hover.y = y;
            this.press.y = y;
            this.disable.y = y;
            for (let i in this.imageRefs) {
                this.imageRefs[i].y = y;
            }
        }
    }

    setAlpha(alpha = 1) {
        for (let i in this.imageRefs) {
            this.imageRefs[i].alpha = alpha;
        }
    }

    setScale(scaleX, scaleY) {
        if (scaleY === undefined) {
            scaleY = scaleX;
        }
        for (let i in this.imageRefs) {
            this.imageRefs[i].scaleX = scaleX;
            this.imageRefs[i].scaleY = scaleY;
        }
    }

    bringToTop() {
        for (let i in this.imageRefs) {
            this.container.bringToTop(this.imageRefs[i]);
        }
    }

    tweenScale(params) {
        let listOfImageRefs = [];
        for (let i in this.imageRefs) {
            listOfImageRefs.push(this.imageRefs[i]);
        }
        gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
            targets: listOfImageRefs,
            tweens: [
                params
            ]
        });
    }

    setOrigin(origX, origY) {
        for (let i in this.imageRefs) {
            this.imageRefs[i].setOrigin(origX, origY);
        }
    }

    tweenToPos(x, y, duration, ease) {
        let tweenObj = {
            targets: this.imageRefs[this.currImageRef],
            ease: ease,
            duration: duration,
            onComplete: () => {
                this.setPos(x, y);
            }
        }
        if (x !== undefined) {
            tweenObj.x = x;
        }
        if (y !== undefined) {
            tweenObj.y = y;
        }
        globalScene.tweens.add(tweenObj);
    }

    disappear() {
        if (this.disappeared) {
            // already disappeared
            return;
        }
        this.disappeared = true;
        this.origX = this.normal.x;
        this.origY = this.normal.y;
        this.origScale = this.imageRefs[this.currImageRef].scaleX;
        this.setPos(0, -9999);
        this.setScale(0.001);
    }

    reappear() {
        if (!this.disappeared) {
            return;
        }
        this.disappeared = false;
        if (this.origX !== undefined && this.origY !== undefined) {
            this.setPos(this.origX, this.origY);
        }
        if (this.origScale !== undefined) {
            this.setScale(this.origScale);
        }
    }

    runFuncOnImage(func) {
        let currImage = this.imageRefs[this.currImageRef];
        func(currImage);
    }

    update() {

    }

    destroy() {
        for (let a in gameObjects.buttonList) {
            if (gameObjects.buttonList[a] === this) {
                gameObjects.buttonList.splice(parseInt(a), 1);
                break;
            }
        }

        for (let i in this.imageRefs) {
            this.imageRefs[i].destroy();
        }
    }
}