const EMPTY = null
const X = 'x';
const O = 'o';
const TILE_SIZE = 120;
const HALF_TILE_SIZE = TILE_SIZE * 0.5;
const BOARD_SIZE = 3;

/**
 * Tic tac toe board initialized in the center of the game
 */
class Board {
    constructor(scene, x, y) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.currentTurn = X;
        this.board = [];
        this.boardAssets = []; // Cleared when we return to main menu
        this.tempBoardAssets = []; // Cleared when we restart a game
        this.gameFinished = false;
        // Create the four lines of the tic-tac-toe board
        let line1 = scene.add.image(this.x + HALF_TILE_SIZE, this.y, 'blackPixel');
        let line2 = scene.add.image(this.x - HALF_TILE_SIZE, this.y, 'blackPixel');
        let line3 = scene.add.image(this.x, this.y - HALF_TILE_SIZE, 'blackPixel');
        let line4 = scene.add.image(this.x, this.y + HALF_TILE_SIZE, 'blackPixel');
        line1.scaleY = 150;
        line2.scaleY = 150;
        line3.scaleX = 150;
        line4.scaleX = 150;
        this.boardAssets.push(line1);
        this.boardAssets.push(line2);
        this.boardAssets.push(line3);
        this.boardAssets.push(line4);

        // Initialize empty 3x3 board
        for (let i = 0; i < BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.board[i][j] = EMPTY;
            }
        }
        // Create a single large button representing clickable area inside the tic tac toe board
        this.boardButton = new Button(
            scene,
            this.onBoardClick.bind(this),
            {
                "ref": "blackPixel",
                "x": this.x,
                "y": this.y,
                scaleX: 160,
                scaleY: 160,
                alpha: 0
            }
        );
        // Set behavior when we're just hoving over the board
        this.boardButton.setOnHoverFunc(this.onBoardHover.bind(this));
        this.boardButton.setOnHoverOutFunc(this.onBoardHoverOut.bind(this));

        this.hoverIconX = scene.add.image(0, 0, 'gameSprites', 'x');
        this.hoverIconX.alpha = 0.33; this.hoverIconX.visible = false;
        this.boardAssets.push(this.hoverIconX);
        this.hoverIconO = scene.add.image(0, 0, 'gameSprites', 'o');
        this.hoverIconO.alpha = 0.33; this.hoverIconO.visible = false;
        this.boardAssets.push(this.hoverIconY);

        // Victory text
        this.victoryText = this.scene.add.text(this.x, this.y - TILE_SIZE * 1.75, '', 
            {fontFamily: 'Times New Roman', fontSize: 28, color: '#000000', align: 'center'});
        this.victoryText.setOrigin(0.5, 0);
        this.boardAssets.push(this.victoryText);
    }

    onBoardHover() {
        if (this.gameFinished) {
            return;
        }
        let x = this.getInteractedCoordX();
        let y = this.getInteractedCoordY();

        let hoverIcon;
        if (this.currentTurn === X) {
            hoverIcon = this.hoverIconX;
        } else {
            hoverIcon = this.hoverIconO;
        }
        if (this.board[x][y] === EMPTY) {
            hoverIcon.visible = true;
            hoverIcon.x = this.coordXToWorldX(x);
            hoverIcon.y = this.coordYToWorldY(y);
        } else {
            hoverIcon.visible = false;
        }
    }

    onBoardHoverOut() {
        this.hoverIconX.visible = false;
        this.hoverIconO.visible = false;
    }


    /**
    * Click detected in the tic tac toe board
    */
    onBoardClick() {
        if (this.gameFinished) {
            return;
        }
        let x = this.getInteractedCoordX();
        let y = this.getInteractedCoordY();
        if (this.board[x][y] === EMPTY) {
            this.board[x][y] = this.currentTurn;
            if (this.currentTurn === X) {
                playSound('tic');
            } else {
                playSound('tac');
            }
            this.createPieceAt(x, y, this.currentTurn);
            let hasWon = this.checkWinCondAfterPiecePlaced(x, y);
            let hasTied = this.checkAllSpacesFilled();
            if (hasWon) {
                this.handleWin();
            } else if (hasTied) {
                this.handleTie();
            } else {
                this.updateTurn();
            }
        }
    }

    /**
    * Creates a visual piece at coordinates x, y
    */
    createPieceAt(x, y, piece) {
        let xPos = this.coordXToWorldX(x);
        let yPos = this.coordYToWorldY(y);
        let newPiece = this.scene.add.image(xPos, yPos, 'gameSprites', piece);
        this.tempBoardAssets.push(newPiece);
    }

    updateTurn() {
        if (this.currentTurn === X) {
            this.currentTurn = O;
        } else {
            this.currentTurn = X;
        }
    }

    handleWin() {
        this.gameFinished = true;
        this.victoryText.setText(this.currentTurn.toUpperCase() + ' Wins!'); 
        this.createEndGameButtons();
        playSound('win');
    }

    handleTie() {
        this.gameFinished = true;
        this.victoryText.setText('Tie Game!'); 
        this.createEndGameButtons();
    }

    /**
    * Creates a replay button and a menu button
    */
    createEndGameButtons() {
        this.replayButton = new Button(
            this.scene,
            this.resetBoard.bind(this),
            {
                "ref": "replay",
                "atlas": "gameSprites",
                "x": this.x - 80,
                "y": gameConsts.height - 40
            },
            {
                "ref": "replayHover",
                "atlas": "gameSprites"
            }
        );

        this.menuButton = new Button(
            this.scene,
            this.returnMenu.bind(this),
            {
                "ref": "menu",
                "atlas": "gameSprites",
                "x": this.x + 80,
                "y": gameConsts.height - 40
            },
            {
                "ref": "menuHover",
                "atlas": "gameSprites"
            }
        );
    }

    /**
    * Check all 4 directions to see if a winning move has been made. Returs true if winning move 
    *  detected. False otherwise.
    */
    checkWinCondAfterPiecePlaced(x, y) {
        let directionsToCheck = [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1}];
        let maxSpacesToCheck = BOARD_SIZE - 1;
        // Attempt to count 3 of the currentTurn piece
        for (let i in directionsToCheck) {
            let direction = directionsToCheck[i];
            let countedInARow = 0;
            for (let j = -maxSpacesToCheck; j <= maxSpacesToCheck; j++) {
                let checkCoordX = x + j * direction.x;
                let checkCoordY = y + j * direction.y;
                // Ensure the coordinates are legal
                if (checkCoordX >= 0 && checkCoordY >= 0 && checkCoordX < BOARD_SIZE && checkCoordY < BOARD_SIZE) {
                    if (this.board[checkCoordX][checkCoordY] === this.currentTurn) {
                        countedInARow++;
                        if (countedInARow === BOARD_SIZE) {
                            // Three in a row!
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
    * Returns a boolean indicating if all spaces in the board have been filled
    */
    checkAllSpacesFilled() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] === EMPTY) {
                    return false;
                }
            }
        }
        return true;
    }

    getInteractedCoordX() {
        if (gameVars.mouseposx < this.x - HALF_TILE_SIZE) {
            return 0;
        } else if (gameVars.mouseposx > this.x + HALF_TILE_SIZE) {
            return 2;
        } else {
            return 1;
        }
    }

    getInteractedCoordY() {
        if (gameVars.mouseposy < this.y - HALF_TILE_SIZE) {
            return 0;
        } else if (gameVars.mouseposy > this.y + HALF_TILE_SIZE) {
            return 2;
        } else {
            return 1;
        }
    }

    coordXToWorldX(x) {
        return this.x + (x - 1) * TILE_SIZE;
    }

    coordYToWorldY(y) {
        return this.y + (y - 1) * TILE_SIZE;
    }

    /**
    * Resets the board to start a fresh new game of tic tac toe
    */
    resetBoard() {
        for (let i in this.tempBoardAssets) {
            this.tempBoardAssets[i].destroy();
        }
        this.currentTurn = X;
        this.gameFinished = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.board[i][j] = EMPTY;
            }
        }
        this.victoryText.setText('');
        this.replayButton.destroy();
        this.menuButton.destroy();
        playSound('button');
    }

    /**
    * Fully cleans up the tic tac toe board and returns to the main menu
    */
    returnMenu() {
        for (let i in this.tempBoardAssets) {
            if (this.tempBoardAssets[i]) {
                this.tempBoardAssets[i].destroy();
            }
        }
        for (let i in this.boardAssets) {
            if (this.boardAssets[i]) {
                this.boardAssets[i].destroy();
            }
        }
        this.replayButton.destroy();
        this.menuButton.destroy();
        this.boardButton.destroy();
        createMenu(this.scene);
        playSound('button');
    }
}