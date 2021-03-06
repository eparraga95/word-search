// ===================
//      CONSTANTES
// ===================

// todas as letras do alfabeto
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


// banco de palavras para usar no jogo
const wordStorage = ['APRENDER', 'ESCUTAR', 'DOR', 'CONFORTO', 'KENZIE', 'FAZER', 'TENTAR', 'SABER', 'ENTENDER', 'ENSINO', 'PROGRAMAR', 'TESTAR', 'ENTRAR', 'PSIQUE', 'ERRAR', 'LER', 'FALAR', 'GOSTAR', 'PROBLEMA', 'LONGE'];


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


// NUMERO ALEATÓRIO DE 0 A n-1
function randomNum(n) {
    return Math.floor(Math.random() * n)
}



// POSICIONA AS PALAVRAS NO BOARD
let numberOfWords = 6;
let wordsToValidate = '';
function wordPositioning(boardToChange) {

    // seleção das palavras
    let selectedWords = [];
    let wordStoreCopy = wordStorage.slice(0);

    for (let i = 0; i < numberOfWords; i++) {
        let index = randomNum(wordStoreCopy.length);
        selectedWords.push(wordStoreCopy[index]);
        wordStoreCopy.splice(index, 1);
    }
    console.log(selectedWords)
    wordsToValidate = selectedWords.slice(0,4);

    
    // invertendo algumas palavras
    selectedWords[0] = selectedWords[0].split('').reverse().join('');
    selectedWords[2] = selectedWords[2].split('').reverse().join('');
    selectedWords[4] = selectedWords[4].split('').reverse().join('');

    // PALAVRAS NA HORIZONTAL

    let horizontalWords = selectedWords.slice(0,2);
    let totalHorizontalWords = horizontalWords.length;

    console.log('horz:' + horizontalWords)

    // seleção das linhas
    const lines = [0,1,2,3,4,5,6,7,8,9];
    let selectedLines = [];

    for (let i = 0; i < 3; i++) {
        let randomIndex = randomNum(lines.length);
        selectedLines.push(lines[randomIndex]);
        lines.splice(randomIndex,1);
    }
    

    // posicionamento no board
    for (let currentWord = 0; currentWord < totalHorizontalWords; currentWord++) {

        let maxWordStart = 10 - (selectedWords[currentWord].length - 1);

        let randomStartCol = randomNum(maxWordStart);

        for (let col = 0; col < selectedWords[currentWord].length; col++) {

            let x = selectedLines[currentWord];
            let y = randomStartCol + col;
            boardToChange[x][y] = selectedWords[currentWord].charAt(col)
        }

    }

    // PALAVRAS NA VERTICAL 

    let verticalWords = selectedWords.slice(2,4);
    let totalVerticalWords = verticalWords.length;

    console.log('vert:' + verticalWords)
 
    // calcular coordenadas possíveis para cada palavra
    let vertWordsAllCoords = [[],[],[]];

    for (let currentWord = 0; currentWord < totalVerticalWords; currentWord++) {
        
        let maxWordStart = boardToChange.length - (verticalWords[currentWord].length - 1)

        for (let col = 0; col < boardToChange.length; col++) {

            for (let testRow = 0; testRow < maxWordStart; testRow++) {

                let counter = 0;
                
                for (let wordChar = 0; wordChar < verticalWords[currentWord].length; wordChar++) {
                    
                    let y = testRow + wordChar;
                    let x = col

                    if (boardToChange[y][x] === "" || boardToChange[y][x] === verticalWords[currentWord].charAt(wordChar) ) {

                        counter++;

                        if (counter === verticalWords[currentWord].length) {

                            let coordY = testRow;
                            let coordX = col;

                            vertWordsAllCoords[currentWord].push([coordX,coordY])   // coluna,linha
                        }                                       

                    } 
                    
                    else {

                        counter = 0;

                    }
                }
            }
        }
    }


    // verifico se foram geradas coordenadas possíveis para todas as palavras
    for (let word = 1; word <= vertWordsAllCoords.length; word++) {

        if (!vertWordsAllCoords[word-1].length) {

            vertWordsAllCoords.splice(word-1,1)         //  
            verticalWords.splice(word-1,1)              //  removem a palavra do jogo
            wordsToValidate.splice(3+(word-1),1)        //

            word--;                                     //  repassa a informação de alteração do tamanho do vetor sendo iterado
        }

    }

    let finalVertCoords = [];

    let usedColumns = [0,1,2,3,4,5,6,7,8,9];
    for (let word = 0; word < vertWordsAllCoords.length; word++) {
        
        let currentWordCoords = vertWordsAllCoords[word].length;

        // caso a palavra só tenha coordenadas possiveis nas colunas já usadas pelas anteriores, a palavra é removida
        let isColumnAvaible = false
        for (let coord = 0; coord < currentWordCoords; coord++) {

            let currentColumn = vertWordsAllCoords[word][coord][0]

            if (usedColumns[currentColumn] !== -1) {
                isColumnAvaible = true
            }
        }
        
        if (!isColumnAvaible) {

            vertWordsAllCoords.splice(word,1);
            verticalWords.splice(word,1);
            wordsToValidate.splice(3+word,1)
            word--;
            continue 
        }
        

        // impede que as colunas sejam repetidas
        let selected = false;
        while (selected === false) {
            
            let randomIndex = randomNum(currentWordCoords);

            let selectedCol = vertWordsAllCoords[word][randomIndex][0];  

            if (usedColumns[selectedCol] !== -1) {

                finalVertCoords.push(vertWordsAllCoords[word][randomIndex]);
                usedColumns[selectedCol] = -1;
                selected = true;
            }
        }
    }

    // posicionamento no board
    for (let word = 0; word < verticalWords.length; word++) {
        let selectedCoord = finalVertCoords[word];
        let currentWord = verticalWords[word]
        
        for (let wordChar = 0; wordChar < currentWord.length; wordChar++) {
            let y = selectedCoord[1] + wordChar
            let x = selectedCoord[0] 
            boardToChange[y][x] = currentWord.charAt(wordChar)
        }
    }

    // PALAVRAS NA DIAGONAL

    let diagonalWords = selectedWords.slice(4,6);
    console.log('diag:' + diagonalWords)



    return boardToChange;
}



// COMPLETA O BOARD
function completeBoard (boardToChange) {

    let totalRows = boardToChange.length;
    let totalCols = boardToChange[0].length

    // completa os espaços em branco no board com letras aleatorias
    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
            
            let randomLetter = alphabet[randomNum(alphabet.length)];
            if (boardToChange[row][col] === '') {
                boardToChange[row][col] = randomLetter;
            }

        }

    }
    return boardToChange;
}

// Clock
let secondCount = 0;

let storeInterval;

const displayP = document.querySelector('.clock');

const displayCount = () => {

    let minutes = Math.floor((secondCount % 3600)/60);
    let seconds = Math.floor(secondCount % 60)

    let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
    let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;

    displayP.textContent = displayMinutes + ':' + displaySeconds;

    secondCount++;

    // Limitando o tempo
    if (secondCount === 121) {

        clearInterval(storeInterval);

        secondCount = 0;

        window.alert('Você não conseguiu encontrar todas as palavras a tempo! Quem sabe na próxima...')

        // desabilita submits
        submitButton.disabled = true;
    }
}


// ENVIA OS DADOS DO BOARD PARA A PÁGINA
function fillGridElements () {
    
    submitButton.disabled = false;

    // abre a interface do jogo pro usuario
    let gameArea = document.querySelector('#mainInput')
    gameArea.classList.remove('inputContainer')
    gameArea.classList.add('inputContainerShown')

    let gameGrid = document.querySelector('#mainGrid');
    gameGrid.classList.remove('gridContainer');
    gameGrid.classList.add('gridContainerShown')


    // limpa as palavras encontradas do jogo antigo
    let lastGameWords = document.getElementById('wordsContainer');
    lastGameWords.innerHTML = '';

    // limpa msg de erro
    let errorMsgContainer = document.querySelector('#errorMessage');
    errorMsgContainer.innerText = '';


    // prepara o container onde serão acrescentados os dados do board
    let gridContainer = document.getElementById('mainGrid');
    gridContainer.innerHTML = '';

    // cria os novos elementos html usando o DOM
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            let newElement = document.createElement('span');
            newElement.classList.add('grid-item');
            newElement.style.gridArea = `${row + 1}/${col + 1}`;
            newElement.setAttribute("tabindex",'1');
            gridContainer.appendChild(newElement);
        }
    }

    // limpa o board para um novo jogo
    let newBoard = board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            newBoard[i][j] = '';            
        }
    }

    // chamo as funções responsáveis por completar o board
    newBoard = wordPositioning(newBoard)
    newBoard = completeBoard(newBoard)


    // passa os dados do board para um array 1d
    let boardList = [];
    for (let i = 0; i < newBoard.length; i++) {
        boardList = boardList.concat(newBoard[i])
    }


    // a partir do novo array, os elementos sao inseridos no grid da página
    for (let i = 0; i < boardList.length; i++) {
        let element = document.querySelectorAll('.grid-item')[i];
        element.innerText = `${boardList[i]}`
    }
    console.log(wordsToValidate)
}
let startGame = document.getElementById('startGame');
startGame.addEventListener('click', fillGridElements);
startGame.addEventListener('click', () => {
    secondCount = 0;
    clearInterval(storeInterval);
    storeInterval = setInterval(displayCount, 1000);
})
displayCount();


// VALIDAÇÃO DAS ENTRADAS
let foundWords = [];
function inputValidator (event) {
    event.preventDefault();

    // elemento da mensagem de erro
    let errorMsgContainer = document.querySelector('#errorMessage');


    // elemento para levar as palavras encontradas
    let foundWordsElement = document.getElementById('wordsContainer');

    // captura o elemento input
    let input = document.getElementById('userInput');

    // captura o valor da entrada do usuario
    let found = document.getElementById('userInput').value
    found = found.toUpperCase();
    found = found.trim();
    console.log(found)

    // outputs
    let words = wordsToValidate;

    if (words.includes(found)) {
        errorMsgContainer.innerText = ''

        let newWordFound = document.createElement('span');
        newWordFound.innerText = ` ${found} `;
        foundWordsElement.appendChild(newWordFound);

        let index = words.indexOf(found)
        words.splice(index,1)

        input.value = '';

        foundWords.push(found);
    } 
    
    else {
        
        if (foundWords.includes(found)) {

            errorMsgContainer.innerText = '';
            errorMsgContainer.innerText = `${found} já foi encontrada!`
        }
        else if (found === '') {

            errorMsgContainer.innerText = 'Mas não tem nada aqui?!'
        } 
        else {

            errorMsgContainer.innerText = '';
            errorMsgContainer.innerText = `${found} não está no jogo!`
        }

        input.value = '';
    }
    
    console.log(words)

    // condição de vitória
    if (!words.length) {
        window.alert('Parabéns Você encontrou todas as palavras! Aperte COMEÇAR para inciar um novo jogo!')

        clearInterval(storeInterval);
        secondCount = 0;
        displayCount();
    }
}
let submitButton = document.getElementById('wordValidation');
submitButton.addEventListener('click', inputValidator)


