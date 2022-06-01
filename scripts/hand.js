class Hand {
    constructor(scene) {
        this.x = -999;
        this.y = -999;
        this.isGrabbing = false;
        this.entity = null;
        this.visual = scene.add.sprite(this.x, this.y, 'hand');
        this.visual.scaleX = 0.95; this.visual.scaleY = 0.95;
        this.visualPoint = scene.add.sprite(this.x, this.y, 'handPoint');
        this.visualPoint.scaleX = 1;
        this.visualPoint.scaleY = 1;
        this.visualPoint.visible = false;
        this.visual.setDepth(1000);
        this.visualPoint.setDepth(1000);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    switchHand() {
        let oldScale = this.visualPoint.scaleX; let oldX = this.visualPoint.x; let oldY = this.visualPoint.y; let oldVis = this.visualPoint.visible;
        this.visualPoint.destroy();
        this.visualPoint = globalScene.add.sprite(this.x, this.y, 'handPointBlood');
        this.visualPoint.scaleX = oldScale; this.visualPoint.scaleY = oldScale;
        this.visualPoint.x = oldX;
        this.visualPoint.y = oldY;
        this.visualPoint.visible = oldVis;
    }

    getPosX() {
        return this.x;
    }

    getPosY() {
        return this.y;
    }

    setDragging(entity) {
        this.entity = entity;
    }

    releaseDragging() {
        this.entity = null;
    }

    getDragging() {
        return this.entity;
    }

    setPointing(val) {
        if (val) {
            if (this.visual.visible) {
                this.visual.visible = false;
                this.visualPoint.visible = true;
                this.visualPoint.scaleX = 1.05; this.visualPoint.scaleY = 1.05;
                setTimeout(() => {
                    this.visualPoint.scaleX = 1.02; this.visualPoint.scaleY = 1.02;
                    setTimeout(() => {
                        this.visualPoint.scaleX = 1; this.visualPoint.scaleY = 1;
                    }, 100);
                }, 50);
            }
        } else if (!this.visual.visible) {
            this.visual.visible = true;
            this.visualPoint.visible = false;
        }
    }

    update(deltaScale) {
        if (this.entity) {
            let distX = this.x - this.entity.x;
            let distY = this.y - this.entity.y;
            let dist = Math.sqrt(distX * distX + distY * distY);
            let accX = distX * 0.12 - this.entity.velX * 0.3;
            let accY = distY * 0.12 - this.entity.velY * 0.3;
            this.entity.addVel(accX, accY);
        }
        let velX = this.x - this.visual.x;
        let velY = this.y - this.visual.y;
        this.visual.x = this.x + velX * 0.2 / deltaScale;
        this.visual.y = this.y + velY * 0.2 / deltaScale;
        this.visualPoint.x = this.x;
        this.visualPoint.y = this.y;
    }
}