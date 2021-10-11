class Game {
    constructor(option) {
        this.end = false;

        this.black = 1;
        this.white = 2;
        this.legal = 3;

        this.player = option;
        this.computer = (this.player == this.black) ? this.white : this.black;

        this.turn = (this.computer == this.black) ? this.computer : this.player;

        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, this.player, this.computer, 0, 0, 0],
            [0, 0, 0, this.computer, this.player, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.dir = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
            [1, 1],
            [-1, -1],
            [-1, 1],
            [1, -1]
        ];

        this.init();
    }

    /**
     * Init Function to trigger update and listener function
     */
    init() {
        this.update();
        this.listener();

        if (this.turn == this.computer) this.computerMove();
    }

    /**
     * Function to update all game state
     */
    update() {
        this.drawBoard();
        this.drawPiece();
        this.removeLegal()

        if (!this.getLegal()) {
            this.end = true;
            
            this.getWinner();
        }

        this.countScore();
    }

    /**
     * Function to get the winner if game end
     */
    getWinner() {
        let computer = 0;
        let player = 0;
        
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.player) {
                    player++;
                }

                else if (col == this.computer) {
                    computer++;
                }
            });
        });

        let winner = (computer > player) ? 'Game End, Computer Win!' : 'Game End, Player Win!';

        alert(winner);
    }

    /**
     * Function to count player score in every game state
     */
    countScore() {
        let computer = 0;
        let player = 0;
        
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.player) {
                    player++;
                }

                else if (col == this.computer) {
                    computer++;
                }
            });
        });

        playerEl.innerHTML = player;
        computerEl.innerHTML = computer;
    }

    /**
     * Reset the legal position in every turn
     */
    removeLegal() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.legal) {
                    this.board[y][x] = 0;
                }
            });
        });
    }

    /**
     * Function to get legal coord
     */
    getLegal() {
        let valid = false;
        let opponent = (this.turn == this.computer) ? this.player : this.computer;

        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.turn) {
                    this.dir.forEach(val => {
                        let [dirX, dirY] = val;

                        if (this.inBoard(y + dirY, x + dirX) && this.board[y + dirY][x + dirX] == opponent) {
                            let tempY = y + dirY;
                            let tempX = x + dirX;

                            while (this.inBoard(tempY, tempX) && this.board[tempY][tempX] == opponent) {
                                if (this.inBoard(tempY + dirY, tempX + dirX) && this.board[tempY + dirY][tempX + dirX] == 0) {
                                    this.board[tempY + dirY][tempX + dirX] = this.legal;

                                    valid = true;
                                }

                                tempY += dirY;
                                tempX += dirX;
                            }
                        }
                    });
                }
            });
        });

        if (this.turn == this.player) this.drawLegal();

        return valid;
    }

    /**
     * Function to draw legal coord to gameboard
     */
    drawLegal() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                let coordX = (x * size) + (size / 2);
                let coordY = (y * size) + (size / 2);

                if (col == this.legal) {
                    ctx.beginPath();
                    ctx.arc(coordX, coordY, size * 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });
        });
    }

    /**
     * Function to check coord still in gameboard
     * 
     * @param {*} y 
     * @param {*} x 
     */
    inBoard(y, x) {
        return x >= 0 && y >= 0 && x < gridX && y < gridY;
    }

    /**
     * Function to handle player move
     * 
     * @param {*} y 
     * @param {*} x 
     */
    playerMove(y, x) {
        if (this.end) return;
        if (this.turn != this.player) return;
        if (this.board[y][x] != this.legal) return;

        this.board[y][x] = this.player;
        this.replace(y, x);

        this.turn = this.computer;
        this.update();
        this.computerMove();
    }

    /**
     *  Function to handle computer move
     */
    computerMove() {
        if (this.end) return;

        let coord = this.getLegalCoord();
        let random = coord[~~(Math.random() * coord.length)];
        
        setTimeout(() => {
            this.board[random.y][random.x] = this.computer;
            this.replace(random.y, random.x);

            this.turn = this.player;
            this.update();
        }, 500);
    }

    /**
     * Function to get all legal
     * 
     * @returns array
     */
    getLegalCoord() {
        let coord = [];

        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.legal) {
                    coord.push({x: x, y: y});
                }
            });
        });

        return coord;
    }

    /**
     * Function to repleace disc
     * 
     * @param {*} y 
     * @param {*} x 
     */
    replace(y, x) {
        let opponent = (this.turn == this.computer) ? this.player : this.computer;

        this.dir.forEach(val => {
            let [dirX, dirY] = val;

            let tempY = y + dirY;
            let tempX = x + dirX;

            while (this.inBoard(tempY, tempX) && this.board[tempY][tempX] == opponent) {
                if (this.last(tempY, tempX, dirX, dirY)) {
                    this.board[tempY][tempX] = this.turn;
                }

                tempY += dirY;
                tempX += dirX;
            }
        });
    }

    /**
     * Function to help replace function to find last disc is same or not
     * 
     * @param {*} y 
     * @param {*} x 
     * @param {*} dirX 
     * @param {*} dirY 
     * @returns bool
     */
    last(y, x, dirX, dirY) {
        let last = false;

        while (this.inBoard(y, x)) {
            if (this.board[y][x] == this.turn) last = true;

            y += dirY;
            x += dirX;
        }

        return last;
    }

    /**
     * Function to draw player or computer disc
     */
    drawPiece() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                let coordX = (x * size) + (size / 2);
                let coordY = (y * size) + (size / 2);

                if (col == this.black) {
                    ctx.fillStyle = 'black';
                    ctx.beginPath();
                    ctx.arc(coordX, coordY, size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                else if (col == this.white) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(coordX, coordY, size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        });
    }

    /**
     * Function to draw Board State
     */
    drawBoard() {
        // draw bg
        ctx.fillStyle = 'rgb(14, 72, 82)';
        ctx.fillRect(0, 0, w, h);

        // vertical line
        for (let i = 0; i < gridY; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, h);
            ctx.stroke();
        }

        // horizontal line
        for (let i = 0; i < gridY; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * size);
            ctx.lineTo(w, i * size);
            ctx.stroke();
        }
    }

    /**
     * Function to listen to player click
     */
    listener() {
        canvas.addEventListener('click', e => {
            let x = ~~(e.offsetX / size);
            let y = ~~(e.offsetY / size);

            this.playerMove(y, x);
        });
    }
}