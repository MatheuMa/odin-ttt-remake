class Player {
    constructor(id, token) {
        this.id = id;
        this.token = token;
    }

    get getToken() {
        return this.token;
    }

    get playerInfo() {
        return `${this.id} - ${this.token}`;
    }
}

const boardControl = (() => {
    let cells = ["", "", "", "", "", "", "", "", "",];

    function getBoard() {
        return cells;
    }

    function makeMove(position, player) {
        if (cells[position] !== "") return false;
        cells[position] = player.getToken;
        return true;
    }

    function reset() {
        cells = ["", "", "", "", "", "", "", "", "",];
    }

    function checkWins(player) {
        const winningLines = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 4, 6],
            [2, 5, 8],
            [3, 4, 5],
            [6, 7, 8]
        ]

        return winningLines.some((line) => {
            return line.every((cell) => cells[cell] === player.getToken);
        })
    }

    function draws() {
        return cells.every((cell) => cell !== "")
    }

    return { getBoard, makeMove, reset, checkWins, draws }
})();

const gameControl = (() => {
    const player1 = new Player("Cross", "x");
    const player2 = new Player("Circle", "o");
    const players = [player1, player2];
    let activeIndex = 0;

    const dialog = document.querySelector("dialog");
    const text = document.querySelector(".text");
    const resetBtn = document.querySelector(".reset-btn");

    resetBtn.addEventListener("click", () => {
        boardControl.reset();
        displayControl.render();
        activeIndex = 0;
        dialog.close();
    })

    function switchTurns() {
        activeIndex = (activeIndex + 1) % players.length;
    }

    function makeTurn(position) {
        const currentPlayer = players[activeIndex];
        const result = boardControl.makeMove(position, currentPlayer);
        if (!result) return;

        displayControl.render();
        
        if (boardControl.checkWins(currentPlayer)) {
            text.textContent = `${currentPlayer.id} wins!`;
            dialog.showModal();
            return;
        } else if (boardControl.draws()) {
            text.textContent = `Draw!`;
            dialog.showModal();
            return;
        }
        
        if (result) {
            boardControl.getBoard();
            switchTurns();
        }
    }

    return { makeTurn }
})();

const displayControl = (() => {
    const body = document.body;
    const board = document.createElement("div");
    board.classList.add("board");
    body.appendChild(board);
    
    function render() {
        board.replaceChildren();

        boardControl.getBoard().forEach((value, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
    
            cell.addEventListener("click", () => {
                gameControl.makeTurn(index);
            })
    
            board.appendChild(cell);

            if (value !== "") {
                const img = document.createElement("img");
                if (value === "o") {
                    img.src = "./img/circle.png";
                    img.alt = "circle";
                } else if (value === "x") {
                    img.src = "./img/cross.png"
                    img.alt="cross"
                }
                cell.appendChild(img);
            }
        });
    }

    return { render }
})();

displayControl.render();