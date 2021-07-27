class Game {
    constructor() {
        this.score = {
            white: 2,
            black: 2
        };

        this.white = 1;
        this.black = 2;

        this.turn = this.white;

        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, this.white, this.black, 0, 0, 0],
            [0, 0, 0, this.black, this.white, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];

        this.directions = [
            [0, 1], // to botoom
            [0, -1], // to top
            [1, 0], // to right
            [-1, 0], // to left
            [1, 1], // diagonal to right bottom
            [-1, -1], // diagonal to top left
            [1, -1], // diagonal to right top
            [-1, 1], // diagonal to bottom left
        ];

        this.drawLine();
        this.listener();
        this.getAllowed();
        this.draw();
    }

    draw() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0 || this.board[i][j] == 3) continue;

                if (this.board[i][j] == this.white) {
                    ctx.strokeStyle = 'white';
                    ctx.fillStyle = 'white';
                }
                if (this.board[i][j] == this.black) {
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'black';
                }

                ctx.beginPath();
                ctx.arc((boxSize * j) + (boxSize / 2), boxSize * i + (boxSize / 2), boxSize * 0.3, 0, Math.PI * 4);
                ctx.stroke();
                ctx.fill();
            }
        }
    }

    update() {
        if (!this.isGameOver()) {
            ctx.clearRect(0, 0, w, h);
            this.drawLine();
            this.clearAllowed();
            this.getAllowed();
            this.draw();
            this.updateSore();
        } else {
            setTimeout(() => {
                if (this.score.white == this.score.black) {
                    alert('Tie!');
                    location.reload();
                }

                (this.score.white > this.black) ? alert('You Win!') : alert('Computer Win!');
                location.reload();
            }, 200);
        }
    }

    updateSore() {
        let white = [];
        let black = [];

        this.board.forEach(row => {
            row.forEach(col => {
                if (col == this.white) white.push(col);
                else if (col == this.black) black.push(col);
            });
        });

        this.score.white = white.length;
        this.score.black = black.length;

        playerScore.innerHTML = this.score.white;
        compScore.innerHTML = this.score.black;
    }

    listener() {
        canvas.addEventListener('click', (e) => {
            let x = ~~(e.offsetX / boxSize);
            let y = ~~(e.offsetY / boxSize);

            if (this.allowed(x, y) && this.turn == this.white) {
                this.board[y][x] = this.turn;
                this.around(x, y);
                this.turn = this.black;
                this.update();
                this.bot();
            }
        });
    }

    bot() {
        setTimeout(() => {
            let x;
            let y;

            while (true) {
                x = this.random();
                y = this.random();

                if (this.allowed(x, y)) break;
            }

            if (this.allowed(x, y) && this.turn == this.black) {
                this.board[y][x] = this.turn;
                this.around(x, y);
                this.draw();
            }
            this.turn = this.white;
            this.update();
        }, 10);
    }

    random() {
        return ~~(Math.random() * length);
    }

    around(x, y) {
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                this.directions.forEach(val => {
                    let [dirX, dirY] = val;

                    let data;
                    if (data = this.check(x, y, dirX, dirY)) {
                        for (let i = 1; i < data.length; i++) {
                            this.board[data[i].y][data[i].x] = this.turn;
                        }
                    }
                });
            }
        }
    }

    check(x, y, dirX, dirY) {
        let coord = [];

        while (this.inBoard(x, y) && (this.board[y][x] != 3 && this.board[y][x] != 0)) {
            coord.push({
                x: x,
                y: y
            });

            x += dirX;
            y += dirY;

            if (!this.inBoard(x, y)) break;
            if (!this.board[y][x]) break;
            if (this.board[y][x] == this.turn) return coord;
        }

        return false;
    }

    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < length && y < length;
    }

    allowed(x, y) {
        if (this.board[y][x] == 3) {
            return true;
        } else {
            return false;
        }
    }

    getAllowed() {
        let coord = [];
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (this.board[i][j] == this.turn) {
                    this.directions.forEach(val => {
                        let [dirX, dirY] = val;
                        
                        let data = this.checkAllowed(i, j, dirX, dirY);
                        if (data.x != '' && data.y != '') {
                            coord.push(data);
                        }
                    });
                }
            }
        }

        coord.forEach(val => {
            this.board[val.y][val.x] = 3;
        });

        if (this.turn == this.white) this.showAllowed(coord);
    }

    checkAllowed(y, x, dirX, dirY) {
        let coord = {
            x: '',
            y: ''
        };
        let opponent = (this.turn == this.black) ? this.white : this.black;
        let x2, y2;

        while (this.inBoard(x + dirX, y + dirY) && this.board[y + dirY][x + dirX] == opponent) {
            x += dirX;
            y += dirY;

            x2 = (x + dirX < 0) ? 0 : x + dirX;
            y2 = (x + dirX < 0) ? 0 : y + dirY;

            if (this.inBoard(x2, y2) && this.board[y2][x2] == 0) {
                coord.y = y2;
                coord.x = x2;

                if (this.board[y2][x2] == 0) break;
            }
        };

        return coord;
    }

    showAllowed() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] != 3) continue;

                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'black';

                ctx.beginPath();
                ctx.arc((boxSize * j) + (boxSize / 2), boxSize * i + (boxSize / 2), boxSize * 0.3, 0, Math.PI * 4);
                ctx.stroke();
            }
        }
    }

    clearAllowed() {
        this.board.forEach((row, i) => {
            row.forEach((col, j) => {
                if (col == 3) this.board[i][j] = 0;
            });
        });
    }

    isGameOver() {
        let over = true;

        this.board.forEach(row => {
            row.forEach(col => {
                if (col == 0) over = false;
            });
        });

        return over;
    }

    drawLine() {
        // Horizontal
        for (let i = 0; i < lines; i++) {
            ctx.strokeStyle = 'rgb(6, 0, 48)';
            ctx.lineWidth = '2';
            ctx.beginPath();
            ctx.moveTo(0, boxSize * i - 1);
            ctx.lineTo(w, boxSize * i - 1);
            ctx.stroke();
        }

        // Vertical
        for (let i = 0; i < lines; i++) {
            ctx.strokeStyle = 'rgb(6, 0, 48)';
            ctx.lineWidth = '2';
            ctx.beginPath();
            ctx.moveTo(boxSize * i - 1, 0);
            ctx.lineTo(boxSize * i - 1, h);
            ctx.stroke();
        }
    }
}