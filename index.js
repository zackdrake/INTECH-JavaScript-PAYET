var components = {
    num_of_rows : 3,
    num_of_cols : 3,
    num_of_bombs : 1,
    bombemoji : '💣',
    flagemoji: '🚩',
    alive : true,
}
var number_of_click = 0;
var using_html = false;
var matrix= new Array();
var bombs_matrix= new Array();

function usingHtml(){
    using_html = true;
    return;
}

function difficultyLevel(row) {
    difficulty_level = row;
    if (row === 1){
        components = {
            num_of_rows : 5,
            num_of_cols : 5,
            num_of_bombs : 5,
            bombemoji : '💣',
            flagemoji: '🚩',
            alive : true,
        }
    }
    if (row === 2){
        components = {
            num_of_rows : 10,
            num_of_cols : 10,
            num_of_bombs : 25,
            bombemoji : '💣',
            flagemoji: '🚩',
            alive : true,
        }
    }
    if (row === 3){
        components = {
            num_of_rows : 15,
            num_of_cols : 25,
            num_of_bombs : 90,
            bombemoji : '💣',
            flagemoji: '🚩',
            alive : true,
        }
    }
}

function startGame() {

    components.bombs = placeBombs();

    if(using_html == true){

        document.getElementById('field').appendChild(createTable());

    }else{

        createTable()

    }

}

function placeBombs() {
    var i, rows = [];

    for (i = 0; i < components.num_of_bombs; i++) {
        placeSingleBomb(rows);
    }

    return rows;
}


function placeSingleBomb(bombs) {

    var nrow, ncol, row, col;
    nrow = Math.floor(Math.random() * components.num_of_rows);
    ncol = Math.floor(Math.random() * components.num_of_cols);
    row = bombs[nrow];

    if (!row) {
        row = [];
        bombs[nrow] = row;
    }

    col = row[ncol];
    bombMatrix(row, col);

    if (!col) {
        row[ncol] = true;
        return
    }
    else {
        placeSingleBomb(bombs);
    }
}

function bombMatrix(row, col){

    return
}

function cellID(i, j) {
    return 'cell-' + i + '-' + j;
}

function createTable() {
    var table, row, td, i, j;

    if(using_html == true){
        table = document.createElement('table');

        for (i=0; i<components.num_of_rows; i++) {
            row = document.createElement('tr');
            for (j=0; j<components.num_of_cols; j++) {
                td = document.createElement('td');
                td.id = cellID(i, j);
                row.appendChild(td);
                addCellListeners(td, i, j);
            }
            table.appendChild(row);
        }
    }else{
        for (let i = 0; i < components.num_of_rows; i++) {
            const arr = new Array(components.num_of_cols).fill(0);
            matrix.push(arr)
            bombs_matrix.push()
        }
    }

    return table;
}

function addCellListeners(td, i, j) {
    td.addEventListener('mousedown', function(event) {
        if (!components.alive) {
            return;
        }
        components.mousewhiches += event.which;
        if (event.which === 3 || this.flagged) {
            return;
        }
        this.style.backgroundColor = 'lightGrey';
    });

    td.addEventListener('mouseup', function(event) {

        if (!components.alive) {
            return;
        }

        if (this.clicked && components.mousewhiches == 4) {
            RevealMore(this, i, j);
        }

        components.mousewhiches = 0;

        if (event.which === 2) {

            if (this.clicked) {
                return;
            }
            if (this.flagged) {
                this.flagged = false;
                this.textContent = '';
            } else {
                this.flagged = true;
                this.textContent = components.flag;
            }

            event.preventDefault();
            event.stopPropagation();

            return false;
        } else if (event.which === 3) {
            handleCellRightClick(this, i, j)
        }
        else {
            handleCellClick(this, i, j);
        }
    });

    td.oncontextmenu = function() {
        return false;
    };
}

function handleCellClick(cell, i, j) {
    if (!components.alive || cell.flagged) {
        return;
    }

    cell.clicked = true;

    if (components.bombs[i][j]) {
        cell.textContent = components.bombemoji;
        gameOver();

    }
    else {
        cell.style.backgroundColor = 'lightGrey';
        num_of_bombs = adjacentBombs(i, j);
        if (num_of_bombs) {
            cell.textContent = num_of_bombs;
        }
        else {
            clickAdjacentBombs(i, j);
        }
    }
}

function handleCellRightClick(cell, i, j) {

    if (!components.alive || cell.flagged) {
        return;
    }

    cell.textContent = components.flagemoji;
}

function adjacentBombs(row, col) {
    var i, j, num_of_bombs;
    num_of_bombs = 0;

    for (i=0; i<3; i++) {
        for (j=0; j<3; j++) {
            if (components.bombs[row + i -1] && components.bombs[row + i -1][col + j -1]) {
                num_of_bombs++;
            }
        }
    }

    return num_of_bombs;
}

function clickAdjacentBombs(row, col) {
    var i, j, cell;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if(using_html == true) {
                cell = document.getElementById(cellID(row + i, col + j));
                if (!!cell && !cell.clicked && !cell.flagged) {
                    handleCellClick(cell, row + i, col + j);
                }
            }else
            {
                cell = matrix[row + i][col + j]
                //TODO equivalent
            }

        }
    }
}

function RevealMore(cell, row, col) {
    if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
        clickAdjacentBombs(row, col);
    }
}

function gameOver() {
    components.alive = false;
    if(using_html == true) {
        document.getElementById('lost').style.display = "block";
    }

}

function reload(){
    window.location.reload();
}

window.addEventListener('load', function() {
    if(using_html == true) {
        document.getElementById('lost').style.display = "none";
    }

    startGame();
});
