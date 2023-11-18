let selectedCells = [];
let grid = [];

document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('wordSearchTable');
    grid = tableToArray(table);
    table.addEventListener('click', handleTableClick);
});

function tableToArray(table) {
    let array = [];
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.textContent);
        }
        array.push(rowData);
    }
    return array;
}

function handleTableClick(event) {
    if (event.target.tagName === 'TD') {
        toggleCellSelection(event.target);
        checkSolution();
    }
}

function toggleCellSelection(cell) {
    const cellIndex = { row: parseInt(cell.dataset.row, 10), col: parseInt(cell.dataset.col, 10) };
    const isSelected = selectedCells.find(c => c.row === cellIndex.row && c.col === cellIndex.col);

    if (isSelected) {
        cell.style.backgroundColor = ''; // Deseleccionar
        selectedCells = selectedCells.filter(c => c.row !== cellIndex.row || c.col !== cellIndex.col);
    } else {
        cell.style.backgroundColor = 'lightblue'; // Seleccionar
        selectedCells.push(cellIndex);
    }
}

function checkSolution() {
    const selectedWord = selectedCells.map(c => grid[c.row][c.col]).join('');
    const reversedSelectedWord = selectedWord.split('').reverse().join('');

    const wordListDiv = document.getElementById('wordList');
    for (let wordDiv of wordListDiv.children) {
        if (wordDiv.textContent === selectedWord || wordDiv.textContent === reversedSelectedWord) {
            highlightSolution();
            break;
        }
    }
}

function highlightSolution() {
    selectedCells.forEach(c => {
        const cell = document.querySelector(`td[data-row="${c.row}"][data-col="${c.col}"]`);
        cell.style.backgroundColor = 'yellow';
    });
    selectedCells = []; // Limpiar selección después de resaltar
}
