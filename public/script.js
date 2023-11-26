let wordPositions = {}; // Definir wordPositions en un alcance global
let cellColorMap = new Map();
let seed = 12345;

document.addEventListener("DOMContentLoaded", function () {
  // Asumiendo que ya tienes una lista de palabras seleccionadas y validadas
  const words = [
    "JAVASCRIPT",
    "VARIABLE",
    "FUNCION",
    "OBJETO",
    "CLASE",
    "HERENCIA",
    "POLIMORFISMO",
    "HTML",
    "CSS",
    "CODIGO",
    "DESARROLLO",
    "CLIENTE",
    "SERVIDOR",
    "FRAMEWORK",
    "LIBRERIA",
    "NODO",
    "EVENTO",
    "LISTENER",
    'php',
    'mysql',
    'java',
    "CONSTANTE",
    "PROGRAMACION",
    "ALGORITMO",
    "DEPURACION",
    "COMPILADOR",
    "EJECUCION",
    "SINTAXIS",
      ];
  const size = 18;
  const grid = createGrid(size);

  // Ordena las palabras de mayor a menor longitud
  words.sort((a, b) => b.length - a.length);

  try {
    validateWords(words, size); // Validación para asegurarse de que las palabras caben
    wordPositions = insertWords(grid, words, size);
    fillEmptySpaces(grid);
    renderGrid(grid);
    renderWordList(words);

    const showSolutionsBtn = document.getElementById("showSolutionsBtn");
    showSolutionsBtn.addEventListener("click", function () {
      showSolutions(wordPositions);
    });
  } catch (error) {
    console.error(error.message);
    // Manejo del error
  }
});

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
    if (direction === 0 || direction === 4) { // Horizontal
        return 'horizontal';
    } else if (direction === 1 || direction === 5) { // Vertical
        return 'vertical';
    } else { // Diagonal
        return 'diagonal';
    }
}

function insertWords(grid, words, size) {
    let wordPositions = {};
    let maxAttempts = 100; // Número máximo de intentos para colocar una palabra

    words.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < maxAttempts) {
            const direction = getRandomDirection();
            const { row, col } = getRandomPosition(size, word.length, direction);
            if (canPlaceWord(grid, word, row, col, direction, size)) {
                const positions = placeWord(grid, word, row, col, direction);
                if (positions && positions.length > 0) {
                    wordPositions[word] = { positions: positions, axis: getAxis(direction) };
                    placed = true;
                }
            }
            attempts++;
        }

        if (!placed) {
            console.log(`No se pudo colocar la palabra "${word}" después de ${maxAttempts} intentos.`);
        }
    });

    return wordPositions;
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
            col = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            break;
        case 4: // Horizontal hacia la izquierda
            row = Math.floor(seededRandom() * size);
            col = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            break;
        case 5: // Vertical hacia arriba
            row = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            col = Math.floor(seededRandom() * size);
            break;
        case 6: // Diagonal hacia arriba y izquierda
            row = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            col = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            break;
        case 7: // Diagonal hacia arriba y derecha
            row = Math.floor(seededRandom() * (size - wordLength + 1)) + wordLength - 1;
            col = Math.floor(seededRandom() * (size - wordLength + 1));
            break;
        default:
            throw new Error('Dirección no válida');
    }
    return { row, col };
}

function getDirectionName(direction) {
    switch (direction) {
        case 0: return 'right';
        case 1: return 'down';
        case 2: return 'downright';
        case 3: return 'downleft';
        case 4: return 'left';
        case 5: return 'up';
        case 6: return 'upleft';
        case 7: return 'upright';
        default: return '';
    }
}

function canPlaceWord(grid, word, row, col, direction, size) {
    for (let i = 0; i < word.length; i++) {
      let newRow = row, newCol = col;
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
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || 
          (grid[newRow][newCol] !== '-' && grid[newRow][newCol] !== word[i])) {
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
        let cellClass = 'word-diagonal'; // Clase base para todas las celdas de palabras diagonales
        if (i === 0) {
            cellClass += ' word-start'; // Añade 'word-start' para la celda de inicio
        } else if (i === word.length - 1) {
            cellClass += ' word-end'; // Añade 'word-end' para la celda de fin
        }
        cellClass += ' ' + getDirectionClass(direction); // Añade la clase de dirección

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
            directionClass = 'horizontal-right';
            break;
        case 1:
            directionClass = 'vertical-down';
            break;
        case 2:
            directionClass = 'diagonal-down-right';
            break;
        case 3:
            directionClass = 'diagonal-down-left';
            break;
        case 4:
            directionClass = 'horizontal-left';
            break;
        case 5:
            directionClass = 'vertical-up';
            break;
        case 6:
            directionClass = 'diagonal-up-left';
            break;
        case 7:
            directionClass = 'diagonal-up-right';
            break;
        default:
            directionClass = '';
            break;
    }
    return directionClass;
}
function fillEmptySpaces(grid) {
  grid.forEach((row) => {
    row.forEach((cell, index) => {
      if (cell === "-") {
        row[index] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    });
  });
}

function renderGrid(grid) {
    const table = document.getElementById("wordSearchTable");
    table.innerHTML = "";
    grid.forEach((row, rowIndex) => {
        let tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
            let td = document.createElement("td");
            td.textContent = typeof cell === 'object' ? cell.letter : cell;
            if (typeof cell === 'object' && cell.class) {
                td.className = cell.class; // Aplica las clases aquí
            }
            td.dataset.row = rowIndex;
            td.dataset.col = colIndex;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}


function renderWordList(words) {
    const wordListDiv = document.getElementById("wordList");
    wordListDiv.innerHTML = "";
    words= words.sort()
    words.forEach((word) => {
        let wordDiv = document.createElement("div");
        wordDiv.textContent = word;
        wordDiv.classList.add("word-item");
        wordDiv.addEventListener('click', () => highlightWord(word));
        wordListDiv.appendChild(wordDiv);
    });
}


function highlightWord(selectedWord) {
    console.log("Palabra seleccionada:", selectedWord); // Para depuración
    console.log("Posiciones:", wordPositions[selectedWord]); // Para depuración

    // Restablecer estilos
    document.querySelectorAll("#wordSearchTable td").forEach(td => {
        td.style.backgroundColor = ''; // Color de fondo original
    });

    // Resaltar la palabra seleccionada
    if (wordPositions[selectedWord]) {
        wordPositions[selectedWord].positions.forEach(pos => {
            const cellSelector = `td[data-row="${pos.row}"][data-col="${pos.col}"]`;
            const cell = document.querySelector(cellSelector);
            if (cell) {
                cell.style.backgroundColor = 'yellow'; // Color de resaltado
            }
        });
    } else {
        console.log("No se encontraron posiciones para:", selectedWord); // Para depuración
    }
}


function showSolutions(wordPositions) {
    Object.keys(wordPositions).forEach((word) => {
        const wordData = wordPositions[word];
        const positions = wordData.positions;

        const color = getColorForWord(word, wordPositions);

        positions.forEach((pos) => {
            const cellSelector = `td[data-row="${pos.row}"][data-col="${pos.col}"]`;
            const cell = document.querySelector(cellSelector);
            if (cell) {
                cell.style.backgroundColor = color;
            }
        });
    });
}

function getColorForWord(word, wordPositions) {
    // Define una paleta de colores.
    const colors = [
        '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF',
        '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'
    ];

    let colorIndex = Object.keys(wordPositions).indexOf(word) % colors.length;
    return colors[colorIndex];
}