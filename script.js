// ===================
//      CONSTANTES
// ===================

// todas as letras do alfabeto
let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


// banco de palavras para usar no jogo
let palavras = ['APRENDER', 'ESCUTAR', 'DOR', 'CONFORTO', 'KENZIE', 'FAZER', 'TENTAR', 'SABER', 'ENTENDER', 'ENSINO', 'PROGRAMAR', 'TESTAR', 'ENTRAR', 'PSIQUE', 'ERRAR', 'LER', 'FALAR', 'GOSTAR', 'PROBLEMA', 'LONGE'];


// o board (tabuleiro) do jogo
let board = [
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
];

// =================
//      FUNÇÕES
// =================


// GERA UM NUMERO ALEATÓRIO
function randomNum(n) {
    return Math.floor(Math.random() * n)
}



// SELECIONA PALAVRAS
function wordSelector(n) {

    let wordCopy = palavras.slice(0)
    let selectedWords = [];

    for (let i = 0; i < n; i++) {
        let index = randomNum(wordCopy.length);
        selectedWords.push(wordCopy[index]);
        wordCopy.splice(index, 1);
    }
    return selectedWords;
}



// SELECIONA LINHAS
function lineSelectorNoRepeat(n) {

    let lines = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let selectedLines = []

    for (let i = 0; i < n; i++) {
        let index = randomNum(lines.length);
        selectedLines.push(lines[index])
        lines.splice(index, 1);
    }
    return selectedLines;
}



// COLOCA PALAVRAS NA HORIZONTAL
function horizontalWords() {

    // seleciona três palavras aleatorias
    let selectedWords = wordSelector(3);

    // define um novo board usando a constante como referência
    let newBoard = board.slice(0);

    // define as linhas onde serao colocadas as palavras baseado no numero de palvras que foram selecionadas
    let randomLines = lineSelectorNoRepeat(selectedWords.length);

    // itera entre as palavras selecionadas
    for (let i = 0; i < selectedWords.length; i++) {

        // define onde a palavra pode começar no grid baseado em seu numero de caracteres
        let maximumWordStart = 10 - (selectedWords[i].length - 1);

        // dentro destes casos possiveis gera um numero aleatorio para o começo da palavra
        let random = randomNum(maximumWordStart);

        // itera entre cada palavra colocando os caracteres no board
        for (let j = 0; j < selectedWords[i].length; j++) {
            newBoard[randomLines[i]][random + j] = selectedWords[i].charAt(j)
        }

    }
    return newBoard;
}


// COMPLETA O BOARD
function completeBoard (board) {

    // completa os espaços em branco no board com letras aleatorias
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            
            // agora as letras podem ser repetidas sem problema, melhora a randomização do board
            let randomLetter = alphabet[randomNum(alphabet.length)];
            if (board[i][j] === ' ') {
                board[i][j] = randomLetter;
            }
        }
    }
    return board;
}


// ENVIA OS DADOS DO BOARD PARA A PÁGINA
function fillGridElements () {
    
    // adiciona no html os elementos onde serão guardados os dados do jogo limpando o conteudo antigo se necessário
    let gridContainer = document.getElementsByClassName('gameContainer')[0];
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    for (let i = 0; i < (board.length)*(board[0].length); i++) {
        let newElement = document.createElement('span');
        newElement.classList.add('grid-item');
        gridContainer.appendChild(newElement);
    }

    // faz o posicionamento de cada elemento dentro do grid
    let col = 1, row = 1;
    const items = document.querySelectorAll('.grid-item')
    items.forEach(item => {
        item.style.gridArea = `${row}/${col}`;
        col++;
        if(col>10){
            col=1;
            row++;
        }
    });

    // passa os dados do board para um array 1d
    let myBoard = horizontalWords();
    myBoard = completeBoard(myBoard);
    console.log(myBoard)    
    let boardList = [];

    for (let i = 0; i < myBoard.length; i++) {
        boardList = boardList.concat(myBoard[i])
    }

    // a partir do novo array, os elementos sao inseridos no grid
    for (let i = 0;i < boardList.length; i++) {
        let element = document.querySelectorAll('.grid-item')[i];
        element.innerText = `${boardList[i]}`
    }

}
let startGame = document.getElementById('startGame');
startGame.addEventListener('click', fillGridElements);




