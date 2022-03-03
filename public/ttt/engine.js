//Variablen Deklaration
const boxes = Array.from(document.getElementsByClassName('box')); //Array bestehend aus den angelegten Boxen
const playText = document.getElementById('playText');
const restartBtn = document.getElementById('restartBtn');
const array = [];
const O_TEXT = "O";
const X_TEXT = "X";
const homeBtn = document.getElementById('homeBtn');
let currentPlayer;

const drawBoard = () => {
    boxes.forEach((box, index) => { //forEach methode: beschreiben des Arrays
        let styleString = '';
        if (index < 3) {
            styleString += `border-bottom: 3px solid var(--purple);`;
        }
        if (index % 3 == 0) {
            styleString += `border-right: 3px solid var(--purple);`;
        }
        if (index % 3 == 2) {
            styleString += `border-left: 3px solid var(--purple);`;
        }
        if (index > 5) {
            styleString += `border-top: 3px solid var(--purple);`;
        }
        box.style = styleString;
        box.addEventListener('click', boxClicked)
    });
};
const boxClicked = (e) => {
    const id = e.target.id;
    if (!array[id]) {
        array[id] = currentPlayer;
        e.target.innerText = currentPlayer;
        if (playerHasWon()) {
            playText.innerText = `${currentPlayer} hat gewonnen!`;
            currentPlayer = '';
            return;
        }

        if (currentPlayer == O_TEXT) {
            currentPlayer = X_TEXT;
        }
        else if (currentPlayer == X_TEXT) {
            currentPlayer = O_TEXT;
        }
    }
};

const playerHasWon = () => {
    if (array[0] == currentPlayer) {
        if (array[1] == currentPlayer && array[2] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt obere Reihe`)
            return true;
        }
        if (array[3] == currentPlayer && array[6] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt linke Reihe`)
            return true;
        }
        if (array[4] == currentPlayer && array[8] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt diagonale Reihe`)
            return true;
        }
    }
    if (array[8] == currentPlayer) {
        if (array[2] == currentPlayer && array[5] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt rechte Reihe`)
            return true;
        }
        if (array[6] == currentPlayer && array[7] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt untere Reihe`)
            return true;
        }
    }
    if (array[4] == currentPlayer) {
        if (array[1] == currentPlayer && array[7] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt mittlere vertikale Reihe`)
            return true;
        }
        if (array[3] == currentPlayer && array[5] == currentPlayer) {
            console.log(`${currentPlayer} gewinnt untere Reihe`)
            return true;
        }
        if (array[2] == currentPlayer && array[6] == currentPlayer) {
            return true;
        }
    }

};


const restart = () => {
    array.forEach((space, index) => {
        array[index] = null;
    });
    boxes.forEach((box) => {
        box.innerText = '';
    });
    playText.innerText = 'Lets Play!';
    currentPlayer = O_TEXT;
};
restartBtn.addEventListener('click', restart);
restart();
drawBoard();

function jumpHome() {
    console.log("Clicked");
    window.location = "../index.html";
}

homeBtn.addEventListener('click', jumpHome);

