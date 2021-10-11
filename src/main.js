const modal = document.querySelector('.modal');
const modalInner = document.querySelector('.modal-inner');
const counter = document.querySelector('.timer');

const sound = document.querySelector('#sound');
const audio = document.querySelector('#audio');

const playerEl = document.querySelector('.player-score');
const computerEl = document.querySelector('.computer-score');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const gridX = 8;
const gridY = 8;

const size = w / 8;

let game;

/**
 * Function To Init The Game
 */
function init(params) {
    counter.style.display = 'block';
    modalInner.style.display = 'none';

    let count = 2;

    let interval = setInterval(() => {
        counter.innerHTML = count;
        count--;
        
        if (count < 0) {
            modal.style.display = 'none';

            clearInterval(interval);
            startGame(params);
        }
    }, 1000);
}

/**
 * Function to start the game
 * 
 * @param {*} choose 
 */
function startGame(choose) {
    game = new Game(choose);
}

/**
 * Sound Controller
 */
sound.addEventListener('change', e => {
    if (e.target.checked) {
        audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
});

function removeDisabled() {
    document.querySelector('.white').disabled = false;
    document.querySelector('.black').disabled = false;
}