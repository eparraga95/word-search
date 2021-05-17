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


// NUMERO ALEATÓRIO DE 0 A n-1
function randomNum(n) {
    return Math.floor(Math.random() * n)
}



// SELECIONA PALAVRAS
let wordsToValidate = '';

function wordSelectorNoRepeat(n) {

    let wordCopy = palavras.slice()
    let selectedWords = [];

    for (let i = 0; i < n; i++) {
        let index = randomNum(wordCopy.length);
        selectedWords.push(wordCopy[index]);
        wordCopy.splice(index, 1);
    }
    wordsToValidate = selectedWords;
    return selectedWords;
}



// SELECIONA LINHAS
function lineSelectorNoRepeat(n) {

    // define um vetor constante com os indices de cada linha do board
    const lines = [0,1,2,3,4,5,6,7,8,9]
    let selectedLines = [];

    // adiciona ao vetor da saida n elementos não aleatórios do vetor lines
    for (let i = 0; i < n; i++) {
        let index = randomNum(lines.length);
        selectedLines.push(lines[index])
        lines.splice(index, 1);
    }
    return selectedLines;
}



// POSICIONA AS PALAVRAS NO BOARD
function wordPositioning(boardToChange) {

    // ==========================================
    //          PALAVRAS NA HORIZONTAL
    // ==========================================


    // seleciona palavras aleatorias do banco de palavras sem repetição
    let selectedWords = wordSelectorNoRepeat(6);
    console.log(selectedWords)

    // define as linhas onde serao colocadas as palavras baseado no numero de palvras que foram selecionadas
    let randomLines = lineSelectorNoRepeat(selectedWords.length-3);


    // itera entre as palavras selecionadas
    for (let i = 0; i < selectedWords.length-3; i++) {


        // define onde a palavra pode começar no grid baseado em seu numero de caracteres e na largura maxima do grid
        let maximumWordStart = 10 - (selectedWords[i].length - 1);


        // dentro destes casos possiveis gera um numero aleatorio para o começo da palavra
        let random = randomNum(maximumWordStart);


        // itera sobre a palavra alocando os caracteres no board
        for (let j = 0; j < selectedWords[i].length; j++) {
            boardToChange[randomLines[i]][random + j] = selectedWords[i].charAt(j)
        }

    }

    // =======================================
    //          PALAVRAS NA VERTICAL 
    // =======================================

    // preparo um array com as palavras que vão ser colocadas na vertical
    let verticalWords = selectedWords.slice(3);
 
    // varrer as colunas do board procurando por coordenadas onde seria possivel imprimir as palavras restantes não ignorando o fato de que as palavras na horizontal já foram impressas
    let possibleVerticalPositions = [[],[],[]];


    // itero sobre o vetor que contém as palavras restantes
    for (let i = 0; i < verticalWords.length; i++) {
        
        // valor maximo do indice onde a palavra pode começar na coluna, para ser impressa por completo
        let maxWordStart = boardToChange[0].length - (verticalWords[i].length - 1)

        // itero sobre cada coluna do board
        for (let x = 0; x < boardToChange.length; x++) {

            // itero sobre todas as posições possíveis da palavra i, na coluna x.
            for (let j = 0; j < maxWordStart; j++) {

                // zero o contador de confirmação a cada nova posição testada
                let counter = 0;

                // itero sobre cada palavra comparando o que já existe no board para poder imprimir palavras na vertical usando caractéres das palavras na horizontal que já foram impressas
                for (let y = 0; y < verticalWords[i].length; y++) {

                    // se a celula que estou testando é um espaço em branco ou exatamente a letra y da palavra i sendo testada no momento, o contador é acrescentado sem descartar esta posição
                    if (boardToChange[y+j][x] === "" || boardToChange[y+j][x] === verticalWords[i].charAt(y) ) {

                        counter++;

                        // se o contador é igual ao tamanho da palavra quer dizer que a mesma pode ser impressa nesta posição, guardamos a posição com carinho
                        if (counter === verticalWords[i].length) {
                            let coordY = (y+j)-(verticalWords[i].length-1);
                            let coordX = x;

                            // guardo no objeto as possiveis coordenadas de cada palavra
                            possibleVerticalPositions[i].push([coordX,coordY])
                        }

                    }

                    // condições que zeram o contador: não é um espaço em branco e é uma letra que não é corresponde a que seria colocada nesta celula, com o contador zerado, esta posição é então descartada
                    if (boardToChange[y+j][x] !== "" && boardToChange[y+j][x] !== verticalWords[i].charAt(y)) {

                        counter = 0;

                    }
                }
            }
        }
    }

    // verifico se foram geradas coordenadas possíveis para todas as palavras
    for (let i = 1; i <= possibleVerticalPositions.length; i++) {
        if (!possibleVerticalPositions[i-1].length) {
            possibleVerticalPositions.splice(i-1,1)
            verticalWords.splice(i-1,1)
            wordsToValidate.splice(3+(i-1),1)
            i--;
        }
    }

    // abro um vetor com as possiveis colunas
    let usedColumns = [0,1,2,3,4,5,6,7,8,9];

    // abro um vetor para guardar as coordenadas selecionadas
    let finalVertCoords = [];

    // itero sobre cada conjunto de coordenadas possíveis para cada palavra
    for (let i = 0; i < possibleVerticalPositions.length; i++) {
        
        // obtenho o tamanho desse conjunto
        let coordSize = possibleVerticalPositions[i].length;

        // itera sobre todo o conjunto de coordenadas gerado para a palavra atual, verificando se nele existe pelo menos uma coordenada que não usa a ou as colunas já utilizadas para a ou as anteriores
        let isColumnUnused = false
        for (let j = 0; j < coordSize; j++) {
            let actualColumn = possibleVerticalPositions[i][j][0]

            if (usedColumns[actualColumn] !== -1) {
                isColumnUnused = true
            }
        }
        // se em todo o conjunto não foi encontrada ao menos uma possivel coordenada que não é em nenhuma coluna já usada, essa palavra é removida do jogo
        if (!isColumnUnused) {
            possibleVerticalPositions.splice(i,1);
            verticalWords.splice(i,1);
            wordsToValidate.splice(3+i,1)
            i--;
            continue 
        }
        
        
        // impede que as colunas sejam repetidas
        let selected = false;
        while (selected === false) {
            
            // pego um indice aleatório do conjunto de coordenadas
            let randomIndex = randomNum(coordSize);

            // para não repetir as colunas e sobreescrever as palavras guardamos a coluna dessa coordenada
            let selectedCol = possibleVerticalPositions[i][randomIndex][0];  

            // se a coluna não foi utilizada ainda
            if (usedColumns[selectedCol] !== -1) {

                // a coordenada é guardada no vetor
                finalVertCoords.push(possibleVerticalPositions[i][randomIndex]);

                // troco o valor da coluna por -1
                usedColumns[selectedCol] = -1;

                // sai do while
                selected = true;

            }
        }
    }

    // imprimo as palavras no board
    for (let i = 0; i < verticalWords.length; i++) {
        let myCoord = finalVertCoords[i];
        let vword = verticalWords[i]
        
        for (let j = 0; j < vword.length; j++) {
            let x = myCoord[1]+j
            let y = myCoord[0] 
            boardToChange[x][y] = vword.charAt(j)
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
    
    // abre a interface do jogo pro usuario
    let gameArea = document.querySelector('.inputContainer')
    gameArea.style.display = "inherit";

    let gameGrid = document.querySelector('.gridContainer');
    gameGrid.style.display = "grid"
    gameGrid.style.gridTemplateRows = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
    gameGrid.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";

    // limpa as palavras encontradas do jogo antigo
    let lastGameWords = document.getElementById('wordsContainer');
    while (lastGameWords.firstChild) {
        lastGameWords.removeChild(lastGameWords.firstChild);
    }

    // limpa msg de erro
    let errorMsgContainer = document.querySelector('#errorMessage');
    errorMsgContainer.innerText = '';


    // prepara o container onde serão acrescentados os dados do board
    let gridContainer = document.getElementsByClassName('gridContainer')[0];
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
    for (let i = 0;i < boardList.length; i++) {
        let element = document.querySelectorAll('.grid-item')[i];
        element.innerText = `${boardList[i]}`
    }

}
let startGame = document.getElementById('startGame');
startGame.addEventListener('click', fillGridElements);




// ========================
// VALIDAÇÃO DAS ENTRADAS
// ========================
let foundWords = [];
function inputValidator () {

    

    // elemento da mensagem de erro
    let errorMsgContainer = document.querySelector('#errorMessage');


    // elemento para levar as palavras encontradas
    let foundWordsElement = document.getElementById('wordsContainer');

    // captura o elemento input
    let input = document.getElementById('userInput');

    // captura o valor da entrada do usuario
    let found = document.getElementById('userInput').value
    found = found.toUpperCase();
    console.log(found)

    // acessa as palavras que foram escolhidas
    let words = wordsToValidate;


    if (words.includes(found)) {
        // remove a msg de erro caso ativada
        errorMsgContainer.innerText = ''

        // inclui a palavra encontrada na página
        let newWordFound = document.createElement('span');
        newWordFound.innerText = ` ${found} `;
        foundWordsElement.appendChild(newWordFound);

        // retira a palavra do nosso vetor para não contar como acerto novamente
        let ind = words.indexOf(found)
        words.splice(ind,1)

        // limpa o campo de entrada
        input.value = '';

        // guarda a palavra encontrada para alterar a msg de erro
        foundWords.push(found);
    } 
    
    else {
        
        if (foundWords.includes(found)) {
            errorMsgContainer.innerText = '';
            errorMsgContainer.innerText = `${found} já foi encontrada!`
        } else if (found === '') {
            errorMsgContainer.innerText = 'Mas não tem nada aqui?!'
        } else {
            errorMsgContainer.innerText = '';
            errorMsgContainer.innerText = `${found} não está no jogo!`
        }
        // limpa o campo de entrada
        input.value = '';
    }
    
    console.log(words)

    // condição de vitória
    if (!words.length) {
        window.alert('Parabéns Você encontrou todas as palavras! Aperte COMEÇAR para inciar um novo jogo!')
    }


}
let submitButton = document.getElementById('wordValidation');
submitButton.addEventListener('click', inputValidator)

// funcionalidade do botão ao pressionar enter
let input = document.querySelector('#userInput');
input.addEventListener("keydown", e =>{

    if(e.keyCode === 13) {
        e.preventDefault()
        document.querySelector('#wordValidation').click();
    }
});



