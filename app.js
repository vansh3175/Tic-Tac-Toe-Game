let boxes = document.querySelectorAll('.box');
let btn = document.querySelector('#start');
let h1 = document.querySelector('h1');
let cmp = document.querySelector('#comp');
let cnt = document.querySelector('.container');
let inputs = Array(9).fill(null);  // Changed to fill(null) for consistency

let p1 = true;
let turns = 0;
let win = false;
let comp = false;
let started = false;

const winComb = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Add click handlers
for (let box of boxes) {
    box.addEventListener('click', () => {
        if (started && !win) {
            let inp = box.id;
            let idx = parseInt(inp.split('-')[1], 10) - 1;
            if (!inputs[idx]) {
                turns++;
                game(inp);
            }
        }
    });
}

// Start game button
btn.addEventListener('click', () => {
    reset();
    comp = false;
    started = true;
    console.log("game started");
});

// Start computer game button
cmp.addEventListener('click', () => {
    console.log("Playing with computer");
    reset();
    started = true;
    comp = true;
});

function giveIdx() {
    let bestMove = minimaxMove(inputs, 'O');
    console.log("AI's best move is at index:", bestMove);
    return bestMove + 1;
}

function minimaxMove(board, player) {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = player;
            let score = minimax(board, 0, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerForAI(board);
    if (result !== null) {
        return result === 'O' ? 1 : -1;
    }
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return bestScore;
    }
}

function checkWinnerForAI(board) {
    for (let comb of winComb) {
        if (board[comb[0]] && 
            board[comb[0]] === board[comb[1]] && 
            board[comb[0]] === board[comb[2]]) {
            return board[comb[0]];
        }
    }
    return null;
}

function reset() {
    inputs = Array(9).fill(null);
    turns = 0;
    cnt.classList.remove("inv");
    win = false;
    p1 = true;
    h1.innerText = "Tic Tac Toe";
    for (let box of boxes) box.innerHTML = "";
}

function animate(comb) {
    for (let c of comb) {
        let box = document.querySelector(`#box-${c + 1} p`);
        if (box) {
            box.classList.add("animate");
            setTimeout(() => {
                box.classList.remove("animate");
            }, 2000);
        }
    }
}

function game(inp) {
    let idx = parseInt(inp.split('-')[1], 10) - 1;
    let box = document.getElementById(inp);
    let icon = document.createElement('p');

    if (p1) {
        inputs[idx] = "X";
        icon.innerHTML = "<b>X</b>";
        box.appendChild(icon);
        check(inputs, "X");
        
        if (!win && comp && turns < 9) {
            setTimeout(() => {
                turns++;
                p1 = false;
                let compIdx = giveIdx();
                inputs[compIdx - 1] = "O";
                let compBox = document.getElementById(`box-${compIdx}`);
                let compIcon = document.createElement('p');
                compIcon.innerHTML = "<b>O</b>";
                compBox.appendChild(compIcon);
                check(inputs, "O");
                p1 = true;
            }, 500);
            return;
        }
    } else {
        inputs[idx] = "O";
        icon.innerHTML = "<b>O</b>";
        box.appendChild(icon);
        check(inputs, "O");
    }

    if (turns === 9 && !win) {
        h1.innerText = "Game Drawn !! Press Start to play again";
        setTimeout(() => {
                cnt.classList.add("inv");
            }, 2000);
        started = false;
    }
    
    p1 = !p1;
}

function check(arr, symb) {
    for (let comb of winComb) {
        if (arr[comb[0]] === symb && 
            arr[comb[1]] === symb && 
            arr[comb[2]] === symb) {
            h1.innerHTML = `<h1>${symb} is the winner !!<br> Press Start to play again</h1>`;
            started = false;
            win = true;
            animate(comb);
            setTimeout(() => {
                cnt.classList.add("inv");
            }, 2000);
            return;
        }
    }
}