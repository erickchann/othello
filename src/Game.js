class Game {
    constructor() {
        this.score = {
            p: 2,
            c: 2
        };

        this.white = 1;
        this.black = 2;
        this.legal = 3;

        this.player = this.white;
        this.comp = this.black;

        this.turn = this.player;

        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, this.player, this.comp, 0, 0, 0],
            [0, 0, 0, this.comp, this.player, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.directions = [
            [0, -1], // top
            [0, 1], // bottom
            [-1, 0], // left
            [1, 0], // right
            [1, 1], // bottom right
            [-1, -1], // top left
            [-1, 1], // bottom left
            [1, -1], // top right
        ];

        this.update();
        this.legalMove();
        this.listener();
    }

    around(x, y) {
        this.directions.forEach(val => {
            let [dirX, dirY] = val;

            let data;
            if (data = this.check(x, y, dirX, dirY)) {
                for (let i = 0; i < data.length; i++) {
                    this.board[data[i].y][data[i].x] = this.turn;
                }
            }
        });
    }

    check(x, y, dirX, dirY) {
        let coord = [];

        x += dirX;
        y += dirY;

        while (this.inBoard(x, y) && (this.board[y][x] != 3 && this.board[y][x] != 0)) {
            coord.push({
                x: x,
                y: y
            });

            if (this.board[y][x] == this.turn) return coord;

            x += dirX;
            y += dirY;
        }
        
        return false;
    }

    legalMove() {
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (this.board[i][j] == this.turn) {
                    this.directions.forEach(val => {
                        let [dirX, dirY] = val;

                        this.getLegalMove(j, i, dirX, dirY);
                    });
                }
            }
        }
    }

    getLegalMove(x, y, dirX, dirY) {
        let opponent = (this.turn == this.comp) ? this.player : this.comp;

        x += dirX;
        y += dirY;

        while (this.inBoard(x, y) && this.board[y][x] == opponent) {
            x += dirX;
            y += dirY;
            
            if (this.inBoard(x, y) && this.board[y][x] == 0) {
                this.board[y][x] = this.legal;
                this.update();
                this.drawLegal();
                
                break;
            }

            if (this.turn == this.player) this.drawLegal();
        }
    }

    removeLegal() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.legal) this.board[y][x] = 0;
                this.draw();
            });
        });
    }

    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < len && y < len;
    }

    isGameOver() {
        this.legalMove();
        let count = this.allowed().length;

        return (count == 0) ? true : false;
    }

    getWinner() {
        let winner = (this.score.p == this.score.c) ? 'Tie!' : (this.score.p > this.score.c) ? 'You Win!' : 'You Lose!';

        alert(winner);
    }

    updateScore() {
        let player = [];
        let comp = [];

        this.board.forEach(row => {
            row.forEach(col => {
                if (col == this.player) player.push(col);
                else if (col == this.comp) comp.push(col);
            });
        });

        this.score.p = player.length;
        this.score.c = comp.length;

        playerScore.innerHTML = this.score.p;
        compScore.innerHTML = this.score.c;
    }

    update() {
        ctx.clearRect(0, 0, w, h);
        this.drawBg();
        this.draw();
        this.updateScore();
    }

    drawLegal() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col != this.legal) return;

                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.arc((size * x + (size / 2)), (size * y + (size / 2)), size * 0.35, 0, Math.PI * 2);
                ctx.stroke();
            });
        });
    }

    draw() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == 0 || col == 3) return;

                if (col == this.player) {
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                } else if (col == this.comp) {
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                }

                ctx.beginPath();
                ctx.arc((size * x + (size / 2)), (size * y + (size / 2)), size * 0.35, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fill();
            });
        });
    }

    drawBg() {
        ctx.strokeStyle = 'black';
        // vertical
        for (let i = 0; i <= 8; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, h);
            ctx.stroke();
        }

        // horizontal
        for (let i = 0; i <= 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * size);
            ctx.lineTo(w, i * size);
            ctx.stroke();
        }
    }

    listener() {
        canvas.addEventListener('click', (e) => {
            let x = ~~(e.offsetX / size);
            let y = ~~(e.offsetY / size);

            if (this.board[y][x] == this.legal && this.turn == this.player) {
                this.board[y][x] = this.player;
                this.around(x, y);
                this.turn = this.comp;
                this.removeLegal();
                this.update();
                if (this.isGameOver()) {
                    this.getWinner();
                    return;
                };
                this.bot();
                this.update();
            }
        });
    }

    bot() {
        let allowed = this.allowed()[~~(Math.random() * this.allowed().length)];
        
        setTimeout(() => {
            this.board[allowed.y][allowed.x] = this.comp;
            this.around(allowed.x, allowed.y);
            this.turn = this.player;
            this.removeLegal();
            if (this.isGameOver()) {
                this.getWinner();
                this.update();

                return;
            };
            this.update();
            this.drawLegal();
        }, 500);
    }

    allowed() {
        const coord = [];

        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col == this.legal) coord.push({
                    x: x,
                    y: y
                });
            });
        });

        return coord;
    }
}