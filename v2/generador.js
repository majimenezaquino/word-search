let wordPositions = [{}]; // Definir wordPositions en un alcance global
let cellColorMap = new Map();
let seed = 123456;

document.addEventListener("DOMContentLoaded", function () {
  // Asumiendo que ya tienes una lista de palabras seleccionadas y validadas

  init();
});
async function getData() {
  const input_url = document.getElementById("input_url");
  if(input_url){
    const url = input_url.value;
    if(url?.length){
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  }
  //data
  //const response = await fetch("https://raw.githubusercontent.com/majimenezaquino/word-search/master/data/record.json");
   const response = await fetch("http://localhost:3000/data");
  const data = await response.json();
  return data;
}
async function init() {
  const book = await getData();
  let pages = book?.data || [];
  if(!pages){
    console.error("No se encontraron datos");
    return;
  }
  const size = 20;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const wordSearch =urlParams.get('s');
  const searchPages =pages?.find((page) => page?.summary?.toUpperCase() === wordSearch?.toUpperCase());

  let currentPage = parseInt(urlParams.get('page')) || 1;
  let limit = 10; // Cantidad de páginas por vista de paginación
  if(wordSearch && wordSearch?.length){
    pages = [searchPages];
    limit=1000;
    currentPage = 1;
  }

  // Calcular índices de inicio y fin para la paginación
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, pages.length);
  let words = [];
  seed = 123456;
  const pageStart =6;
  for(let index = startIndex; index < endIndex; index++){
    const page = pages[index];
    const pageId = `page_${index}`;
    const container_words_id = `list_words_${index}`;
    const contentPage =  document.createElement("div");
    contentPage.classList.add("page");
    contentPage.setAttribute("id", pageId);
    contentPage.innerHTML = `
    <div class="header">
      <h3>
        ${page.summary}
      </h3>
    </div>
    <div class="word_search_container"></div>
    <div class="footer">
      <div class="container_qr_code"></div>
      <div class="container_words" id="${container_words_id}"></div>
   
    </div>
    <div class="footer_page"> page ${index+pageStart}</div>
    `
    document.querySelector("#contenido-para-pdf").appendChild(contentPage);
    words = page?.words.filter((word) => allowTest(word));
    words.sort((a, b) => b.length - a.length);
    const size = 20; //page.size;
    //console.log("words");
    const input_url_base = document.getElementById("input_url_base").value;
    if(!(input_url_base?.length)){
      alert("No se encontró la url base");
    }
    const grid = createGrid(size);
      const textEndode = encodeURIComponent(page.summary);
      const qr_text = `${input_url_base}/index.html?s=${textEndode}`;
      generateQR(pageId,qr_text);
      validateWords(words, size); // Validación para asegurarse de que las palabras caben
      wordPositions[index] = insertWords(grid, words, size);
      fillEmptySpaces(grid);
      renderGrid(pageId,grid);
     
      rendercontainer_words(pageId,index,container_words_id,words);
  
  
  }

  const btn_soluctions = document.getElementById("btn_soluctions");
  let show = false;
  if(btn_soluctions){
    btn_soluctions.addEventListener("click", function () {
      show = !show;
      addClassSolution(words,show);
      if(!show){
        btn_soluctions.innerHTML = "Show solutions";
      }else{
         btn_soluctions.innerHTML = "Hide solutions";
      }
    });
  }
 


}
function allowTest(input) {
  if(input.length >15){
    console.error("Word error length: ",input);
    return true;
  }
  // Esta expresión regular permite solo letras y espacios
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+$/ ;

  // Prueba si el input cumple con la expresión regular
  if (regex.test(input)) {
      return true; // El input solo contiene texto
  } else {
    console.error("Word error: ",input);
      return true; // El input contiene números o símbolos
  }
}

function createGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = "-";
    }
  }
  return grid;
}
function validateWords(words, size) {
  const totalCells = size * size;
  const totalLetters = words.reduce((sum, word) => sum + word.length, 0);

  if (totalLetters > totalCells) {
    throw new Error(
      "Hay demasiadas letras para ajustar en la cuadrícula de la sopa de letras."
    );
  }

  // También podrías querer verificar que ninguna palabra sea más larga que el tamaño de la cuadrícula
  for (const word of words) {
    if (word.length > size) {
      throw new Error(
        "Una o más palabras son demasiado largas para la cuadrícula de la sopa de letras: " + word
      );
    }
  }
  const wordTooLong = words.some((word) => word.length > size);
  if (wordTooLong) {
    throw new Error(
      "Una o más palabras son demasiado largas para la cuadrícula de la sopa de letras."
    );
  }

  // Si todo está bien, puedes proceder con la inserción de palabras
}
function getAxis(direction) {
  // Definir el eje basado en la dirección
  if (direction === 0 || direction === 4) {
    // Horizontal
    return "horizontal";
  } else if (direction === 1 || direction === 5) {
    // Vertical
    return "vertical";
  } else {
    // Diagonal
    return "diagonal";
  }
}

function insertWords(grid, words, size) {
  let _wordPositions = {};
  let maxAttempts = 200; // Número máximo de intentos para colocar una palabra

  words.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const direction = getRandomDirection();
      const { row, col } = getRandomPosition(size, word.length, direction);
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        const positions = placeWord(grid, word, row, col, direction);
        if (positions && positions.length > 0) {
          _wordPositions[word] = {
            positions: positions,
            axis: getAxis(direction),
          };
          placed = true;
        }
      }
      attempts++;
    }

    if (!placed) {
      console.log(
        `No se pudo colocar la palabra "${word}" después de ${maxAttempts} intentos.`
      );
    }
  });

  return _wordPositions;
}
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function getRandomDirection() {
  return Math.floor(seededRandom() * 8);
}

function getRandomPosition(size, wordLength, direction) {
  let row, col;
  switch (direction) {
    case 0: // Horizontal hacia la derecha
      row = Math.floor(seededRandom() * size);
      col = Math.floor(seededRandom() * (size - wordLength + 1));
      break;
    case 1: // Vertical hacia abajo
      row = Math.floor(seededRandom() * (size - wordLength + 1));
      col = Math.floor(seededRandom() * size);
      break;
    case 2: // Diagonal hacia abajo y derecha
      row = Math.floor(seededRandom() * (size - wordLength + 1));
      col = Math.floor(seededRandom() * (size - wordLength + 1));
      break;
    case 3: // Diagonal hacia abajo y izquierda
      row = Math.floor(seededRandom() * (size - wordLength + 1));
      col =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      break;
    case 4: // Horizontal hacia la izquierda
      row = Math.floor(seededRandom() * size);
      col =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      break;
    case 5: // Vertical hacia arriba
      row =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      col = Math.floor(seededRandom() * size);
      break;
    case 6: // Diagonal hacia arriba y izquierda
      row =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      col =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      break;
    case 7: // Diagonal hacia arriba y derecha
      row =
        Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
      col = Math.floor(seededRandom() * (size - wordLength + 1));
      break;
    default:
      throw new Error("Dirección no válida");
  }
  return { row, col };
}

function getDirectionName(direction) {
  switch (direction) {
    case 0:
      return "right";
    case 1:
      return "down";
    case 2:
      return "downright";
    case 3:
      return "downleft";
    case 4:
      return "left";
    case 5:
      return "up";
    case 6:
      return "upleft";
    case 7:
      return "upright";
    default:
      return "";
  }
}

function canPlaceWord(grid, word, row, col, direction, size) {
  for (let i = 0; i < word.length; i++) {
    let newRow = row,
      newCol = col;
    switch (direction) {
      case 0:
        newCol += i;
        break; // Horizontal hacia la derecha
      case 1:
        newRow += i;
        break; // Vertical hacia abajo
      case 2:
        newRow += i;
        newCol += i;
        break; // Diagonal hacia abajo y derecha
      case 3:
        newRow += i;
        newCol -= i;
        break; // Diagonal hacia abajo y izquierda
      case 4:
        newCol -= i;
        break; // Horizontal hacia la izquierda
      case 5:
        newRow -= i;
        break; // Vertical hacia arriba
      case 6:
        newRow -= i;
        newCol -= i;
        break; // Diagonal hacia arriba y izquierda
      case 7:
        newRow -= i;
        newCol += i;
        break; // Diagonal hacia arriba y derecha
    }

    // Verificar que la celda está libre o tiene la misma letra.
    if (
      newRow < 0 ||
      newRow >= size ||
      newCol < 0 ||
      newCol >= size ||
      (grid[newRow][newCol] !== "-" && grid[newRow][newCol] !== word[i])
    ) {
      return false;
    }
  }
  return true;
}

function placeWord(grid, word, row, col, direction) {
  let positions = [];
  for (let i = 0; i < word.length; i++) {
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case 0: // Horizontal hacia la derecha
        newCol += i;
        break;
      case 1: // Vertical hacia abajo
        newRow += i;
        break;
      case 2: // Diagonal hacia abajo y derecha
        newRow += i;
        newCol += i;
        break;
      case 3: // Diagonal hacia abajo y izquierda
        newRow += i;
        newCol -= i;
        break;
      case 4: // Horizontal hacia la izquierda
        newCol -= i;
        break;
      case 5: // Vertical hacia arriba
        newRow -= i;
        break;
      case 6: // Diagonal hacia arriba y izquierda
        newRow -= i;
        newCol -= i;
        break;
      case 7: // Diagonal hacia arriba y derecha
        newRow -= i;
        newCol += i;
        break;
    }
    let cellClass = "word-diagonal"; // Clase base para todas las celdas de palabras diagonales
    if (i === 0) {
      cellClass += " word-start"; // Añade 'word-start' para la celda de inicio
    } else if (i === word.length - 1) {
      cellClass += " word-end"; // Añade 'word-end' para la celda de fin
    }
    cellClass += " " +  word.toLowerCase(); // Añade la clase de la palabra 
    cellClass += " " + getDirectionClass(direction); // Añade la clase de dirección

    grid[newRow][newCol] = { letter: word[i], class: cellClass };
    positions.push({ row: newRow, col: newCol });
  }
  return positions;
}
function getDirectionClass(direction) {
  // Esta función devuelve la clase basada en la dirección para su uso en CSS
  let directionClass;
  switch (direction) {
    case 0:
      directionClass = "horizontal-right";
      break;
    case 1:
      directionClass = "vertical-down";
      break;
    case 2:
      directionClass = "diagonal-down-right";
      break;
    case 3:
      directionClass = "diagonal-down-left";
      break;
    case 4:
      directionClass = "horizontal-left";
      break;
    case 5:
      directionClass = "vertical-up";
      break;
    case 6:
      directionClass = "diagonal-up-left";
      break;
    case 7:
      directionClass = "diagonal-up-right";
      break;
    default:
      directionClass = "";
      break;
  }
  return directionClass;
}
function fillEmptySpaces(grid) {
  grid.forEach((row) => {
    row.forEach((cell, index) => {
      if (cell === "-") {
        row[index] = String.fromCharCode(65 + Math.floor(seededRandom() * 26));
      }
    });
  });
}

function renderGrid(pageId, grid) {
  const table = document.querySelector(`#${pageId} .word_search_container`);
  table.innerHTML = "";
  grid.forEach((row, rowIndex) => {
    // let tr = document.createElement("div");
    // tr.className = "row";
    row.forEach((cell, colIndex) => {
      let td = document.createElement("div");
      td.className = "cell";
      td.innerHTML = typeof cell === "object" ? `<span> ${cell.letter} </span>` : `<span> ${cell} </span>` ;
      if (typeof cell === "object" && cell.class) {
        td.className = cell.class; // Aplica las clases aquí
      }
      td.dataset.row = rowIndex;
      td.dataset.col = colIndex;
      table.appendChild(td);
    });
    //table.appendChild(tr);
  });
}

function rendercontainer_words(pageId,index,elementId,words) {
  const container_wordsDiv = document.getElementById(elementId);
  container_wordsDiv.innerHTML = "";
  words = words.sort();
  words.forEach((word) => {
    let wordDiv = document.createElement("div");
    wordDiv.innerHTML = `<span>${word}</span>`;
    wordDiv.classList.add("word-item");
    wordDiv.addEventListener("click", () =>{
      // wordDiv.classList.toggle("active");
      addClassSolution([word],true);
    });
    container_wordsDiv.appendChild(wordDiv);
  });
}

function highlightWord(pageId,index,selectedWord) {
  console.log("Palabra seleccionada in table:" ,pageId, selectedWord); // Para depuración
  console.log("Posiciones:", wordPositions[index][selectedWord]); // Para depuración

  // Restablecer estilos
  document.querySelectorAll(`#${pageId} .word_search_container .cell`).forEach((td) => {
    td.style.backgroundColor = ""; // Color de fondo original
  });

  // Resaltar la palabra seleccionada
  if (wordPositions[index][selectedWord]) {
    wordPositions[index][selectedWord].positions.forEach((pos) => {
      const cellSelector = `#${pageId} div[data-row="${pos.row}"][data-col="${pos.col}"]`;
      const cell = document.querySelector(cellSelector);
      if (cell) {
        cell.style.backgroundColor = "yellow"; // Color de resaltado
      }
    });
  } else {
    console.log("No se encontraron posiciones para:", selectedWord); // Para depuración
  }
}

function showSolutions(_wordPositions) {
  _wordPositions = _wordPositions.map((wordPosition) => {
    if (!wordPosition) {
      return false;
    }
    return wordPosition;
  });
  for(const [index, posistionWord] of _wordPositions.entries()){
    if (!posistionWord) {
      continue;
    }
    Object.keys(posistionWord).forEach((word) => {
      const wordData = posistionWord[word];
      const positions = wordData.positions;
      const pageId = `page_${index}`;
      const color = getColorForWord(word, posistionWord);
  
      positions.forEach((pos) => {
        const cellSelector = `#${pageId} div[data-row="${pos.row}"][data-col="${pos.col}"]`;
        const cell = document.querySelector(cellSelector);
        if (cell) {
          cell.style.backgroundColor = color;
        }
      });
    });
  }
}

function getColorForWord(word, _wordPositions) {
  // Define una paleta de colores.
  const colors = [
    "#FFADAD",
    "#FFD6A5",
    "#FDFFB6",
    "#CAFFBF",
    "#9BF6FF",
    "#A0C4FF",
    "#BDB2FF",
    "#FFC6FF",
  ];

  let colorIndex = Object.keys(_wordPositions).indexOf(word) % colors.length;
  return colors[colorIndex];
}

function generateQR(pageId, text) {
  // Primero, verifica si el contenedor para el QR existe
  const container = document.querySelector(`#${pageId} .container_qr_code`);
  if (!container) {
    console.error(`No se encontró el contenedor para la página ${pageId}`);
    return;
  }

  // Crea un div temporal para contener el QR generado
  const tempDiv = document.createElement('div');

  // Genera el QR y lo añade al div temporal
  let qr = new QRCode(tempDiv, {
    text: text,
    width: 160,
    height: 160,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Crea un canvas y lo añade al contenedor
  const canvas = document.createElement('canvas');
  canvas.width = 160; // Establece el tamaño deseado para el canvas
  canvas.height = 160;
  container.appendChild(canvas); // Añade el canvas al contenedor
  let context = canvas.getContext("2d");

  setTimeout(function () {
    // Encuentra el canvas del QR generado dentro del div temporal
    let qrCanvas = tempDiv.querySelector('canvas');
    if (qrCanvas) {
      // Dibuja el QR en el nuevo canvas
      context.drawImage(qrCanvas, 0, 0, canvas.width, canvas.height);
    } else {
      console.error('No se pudo generar el QR.');
    }
    // Opcional: elimina el div temporal si no se necesita
    tempDiv.remove();
  }, 500);
}

function addClassSolution(words,show) {
  const elements = document.querySelectorAll(".word_search_container > div");
  if (elements.length) {
    elements.forEach((element) => {
      element.classList.remove("solution");
      element.style.zIndex = 0;
    });
  }

  for (let i = 0; i < words.length; i++) {
    const _classs = words[i].toLowerCase();
    const elements = document.querySelectorAll(`.${_classs}`);
    if (elements.length) {
      elements.forEach((element) => {
        element.style.zIndex = i + 1;
        element.classList.remove("solution");
        if(show){
          element.classList.add("solution");
        }
        
      });
    }
  }
}