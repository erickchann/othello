const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const playerScore = document.querySelector('#player');
const compScore = document.querySelector('#comp');

const w = canvas.width;
const h = canvas.height;

const length = 8;
const boxSize = Math.round(w / length);
const lines = Math.round(w / boxSize);

let game;

window.onload = init();
function init() {
    game = new Game();

    playerScore.innerHTML = game.score.white;
    compScore.innerHTML = game.score.black;
}