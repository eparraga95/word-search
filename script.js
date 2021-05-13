// ===================
//      CONSTANTES
// ===================

// todas as letras do alfabeto
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


// banco de palavras para usar no jogo
const palavras = ['APRENDER', 'ESCUTAR', 'DOR', 'CONFORTO', 'KENZIE', 'FAZER', 'TENTAR', 'SABER', 'ENTENDER', 'ENSINO', 'PROGRAMAR', 'TESTAR', 'ENTRAR', 'PSIQUE', 'ERRAR', 'LER', 'FALAR', 'GOSTAR', 'PROBLEMA', 'LONGE'];


// o board (tabuleiro) do jogo
const board = [
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
];


// =================
//      FUNÇÕES
// =================


// GERA UM NUMERO ALEATÓRIO DE 0 n-1
function randomNum(n) {
    return Math.floor(Math.random() * n)
}



// SELECIONA PALAVRAS
function wordSelector(n) {

    let wordCopy = palavras.slice()
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

    // define um vetor constante com os indices de cada linha do board
    let lines = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let selectedLines = [];

    // adiciona ao vetor da saida n elementos não aleatórios do vetor lines
    for (let i = 0; i < n; i++) {
        let index = randomNum(lines.length);
        selectedLines.push(lines[index])
        lines.splice(index, 1);
    }
    return selectedLines;
}



// COLOCA PALAVRAS NA HORIZONTAL
function horizontalWords(boardToChange) {


    // seleciona três palavras aleatorias
    let selectedWords = wordSelector(3);


    // define as linhas onde serao colocadas as palavras baseado no numero de palvras que foram selecionadas
    let randomLines = lineSelectorNoRepeat(selectedWords.length);


    // itera entre as palavras selecionadas
    for (let i = 0; i < selectedWords.length; i++) {


        // define onde a palavra pode começar no grid baseado em seu numero de caracteres e na largura maxima do grid
        let maximumWordStart = 10 - (selectedWords[i].length - 1);


        // dentro destes casos possiveis gera um numero aleatorio para o começo da palavra
        let random = randomNum(maximumWordStart);


        // itera sobre a palavra alocando os caracteres no board
        for (let j = 0; j < selectedWords[i].length; j++) {
            boardToChange[randomLines[i]][random + j] = selectedWords[i].charAt(j)
        }

    }
    return boardToChange;
}



// COMPLETA O BOARD
function completeBoard (boardToChange) {


    // completa os espaços em branco no board com letras aleatorias
    for (let i = 0; i < boardToChange.length; i++) {
        for (let j = 0; j < boardToChange[i].length; j++) {
            

            // agora as letras podem ser repetidas sem problema, melhora a randomização do board
            let randomLetter = alphabet[randomNum(alphabet.length)];
            if (boardToChange[i][j] === '') {
                boardToChange[i][j] = randomLetter;
            }

        }

    }
    return boardToChange;
}



// ENVIA OS DADOS DO BOARD PARA A PÁGINA
function fillGridElements () {
    
    // prepara o container onde serão acrescentados os dados do board
    let gridContainer = document.getElementsByClassName('gameContainer')[0];
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }


    // cria os novos elementos html usando o DOM
    for (let i = 0; i < (board.length)*(board[0].length); i++) {
        let newElement = document.createElement('span');
        newElement.classList.add('grid-item');
        newElement.setAttribute("tabindex",'1');
        gridContainer.appendChild(newElement);
    }


    // faz o posicionamento ordenado de cada espaço do grid
    let col = 1
    let row = 1;
    const items = document.querySelectorAll('.grid-item')
    items.forEach(item => {
        item.style.gridArea = `${row}/${col}`;
        col++;
        if(col>10){
            col=1;
            row++;
        }
    });

    
    // limpa o board para um novo tabuleiro
    let newBoard = board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            newBoard[i][j] = '';            
        }
    }

    // chamo as funções responsáveis por completar o board
    newBoard = horizontalWords(newBoard)
    newBoard = completeBoard(newBoard)


    // passa os dados do board para um array 1d
    let boardList = [];
    for (let i = 0; i < newBoard.length; i++) {
        boardList = boardList.concat(newBoard[i])
    }


    // a partir do novo array, os elementos sao inseridos no grid
    for (let i = 0;i < boardList.length; i++) {
        let element = document.querySelectorAll('.grid-item')[i];
        element.innerText = `${boardList[i]}`
    }

}
let startGame = document.getElementById('startGame');
startGame.addEventListener('click', fillGridElements);




