const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const playerScore = document.querySelector('#player');
const compScore = document.querySelector('#comp');

const w = canvas.width;
const h = canvas.height;

const len = 8;
const size = w / len;

let game;
window.onload = init();

function init() {
    game = new Game();
}