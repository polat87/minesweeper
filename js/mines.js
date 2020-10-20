"use strict";

let matrix = [];
let ROwS = 11, COLUMNS = 11;
let NOT_STARTED = 0, RUNNING = 1, GAME_OVER = 2;
let BOMBS = 10;

let hidden = 81;
let time = 0;
let username = "";
let flags = 10;
let clock;
let score = 0;
let scoringList = getScoringList();
let state = NOT_STARTED;
let debug_mode = false;

initMatrix();

function initMatrix() {
    let id = 0;
    for (let row = 0; row < ROwS; row++) {
        matrix[row] = [];
        for (let col = 0; col < COLUMNS; col++) {
            if ((row == 0 || row == 10) || (col == 0 || col == 10)) {
                matrix[row][col] = { value: -1, bomb: false, open: false, id: id++, row: row, col: col };
            }
            else{
                matrix[row][col] = { value: 0, bomb: false, open: false, id: id++, row: row, col: col };
            }
        }
    }

    placeBombs();
    calcNeighbours();
    renderMatrixToTable();
}

function placeBombs() {

    let bombed_cells = 0;
    while(bombed_cells != BOMBS)
    {
        let row = Math.ceil(Math.random() * 9);
        let col = Math.ceil(Math.random() * 9);
        if (matrix[row][col].value != 'B'){
            matrix[row][col].value = 'B';
            bombed_cells++;
        }        
    }
}

function calcNeighbours() {
    for (let i = 1; i < ROwS - 1; i++) {
        for (let j = 1; j < COLUMNS - 1; j++) {
            if (matrix[i][j].value == 0) {
                let bombs = 0;
                bombs += matrix[i - 1][j - 1].value == 'B' ? 1 : 0;
                bombs += matrix[i - 1][j].value == 'B' ? 1 : 0;
                bombs += matrix[i - 1][j + 1].value == 'B' ? 1 : 0;

                bombs += matrix[i][j - 1].value == 'B' ? 1 : 0;
                bombs += matrix[i][j + 1].value == 'B' ? 1 : 0;

                bombs += matrix[i + 1][j - 1].value == 'B' ? 1 : 0;
                bombs += matrix[i + 1][j].value == 'B' ? 1 : 0;
                bombs += matrix[i + 1][j + 1].value == 'B' ? 1 : 0;
                matrix[i][j].value = bombs;
            }
        }
    }
}

function renderMatrixToTable() {
    let container = document.querySelector("#board");

    for (let i = 0; i < ROwS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let elem = document.createElement("div");
            elem.setAttribute("row", i.toString());
            elem.setAttribute("col", j.toString());
            elem.id = matrix[i][j].id;
            elem.classList.add("cell");

            if (matrix[i][j].value != -1)
                elem.addEventListener("mousedown", openCell);

            if (matrix[i][j].value == -1)
                elem.classList.add("edge");
            container.appendChild(elem);
        }
    }
}

function updateCells(island) {
    island.forEach(function (cell) {
        cell.open = true;
        cell.value = "";
        document.getElementById(cell.id).classList.add("open");
        document.getElementById(cell.id).removeEventListener("mousedown", openCell);
        hidden--;
    });
}

function openBoundedCells() {
    let bound = [];

    island.forEach(function (cell) {
        let r = cell.row;
        let c = cell.col;

        if ((matrix[r - 1][c - 1].value > 0) && !(bound.includes(matrix[r - 1][c - 1]))) {
            bound.push(matrix[r - 1][c - 1]);
        }
        if ((matrix[r - 1][c].value > 0) && !(bound.includes(matrix[r - 1][c]))) {
            bound.push(matrix[r - 1][c]);
        }
        if ((matrix[r - 1][c + 1].value > 0) && !(bound.includes(matrix[r - 1][c + 1]))) {
            bound.push(matrix[r - 1][c + 1]);
        }

        if ((matrix[r][c - 1].value > 0) && !(bound.includes(matrix[r][c - 1]))) {
            bound.push(matrix[r][c - 1]);
        }
        if ((matrix[r][c + 1].value > 0) && !(bound.includes(matrix[r - 1][c + 1]))) {
            bound.push(matrix[r][c + 1]);
        }

        if ((matrix[r + 1][c - 1].value > 0) && !(bound.includes(matrix[r + 1][c - 1]))) {
            bound.push(matrix[r + 1][c - 1]);
        }
        if ((matrix[r + 1][c].value > 0) && !(bound.includes(matrix[r + 1][c]))) {
            bound.push(matrix[r + 1][c]);
        }
        if ((matrix[r + 1][c + 1].value > 0) && !(bound.includes(matrix[r + 1][c + 1]))) {
            bound.push(matrix[r + 1][c + 1]);
        }
    });

    bound.forEach(function (cell) {
        if(cell.open != true){        
            cell.open = true;
            document.getElementById(cell.id).innerText = cell.value;
            document.getElementById(cell.id).classList.add("open");
            hidden--;
            let color = cell.value == 1 ? "red" : cell.value == 2 ? "blue" : cell.value == 3 ? "green": "yellow";
            document.getElementById(cell.id).classList.add(color);
            document.getElementById(cell.id).removeEventListener("mousedown", openCell);
        }
    });
}

let island = [];
function openAllAdjacentFreeNeighbours(row, col) {
    matrix[row][col].open = true;
    getNeighbours(row, col);
    updateCells(island);
    openBoundedCells();
    island = [];
}

function getNeighbours(row, col) {
    let i = new Number(row);
    let j = new Number(col);

    if (island.includes(matrix[row][col]))
        return;

    island.push(matrix[i][j]);

    if ((matrix[i - 1][j].value == 0) && !(island.includes(matrix[i - 1][j]))) {
        getNeighbours(i - 1, j);
    }
    if ((matrix[i][j - 1].value == 0) && !(island.includes(matrix[i][j - 1]))) {
        getNeighbours(i, j - 1);
    }
    if ((matrix[i][j + 1].value == 0) && !(island.includes(matrix[i][j + 1]))) {
        getNeighbours(i, j + 1);
    }
    if ((matrix[i + 1][j].value == 0) && !(island.includes(matrix[i + 1][j]))) {
        getNeighbours(i + 1, j);
    }
}

function showAllBombs()
{
    state = GAME_OVER;
    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
            if (matrix[i][j].value == 'B') {
                let cell = document.getElementById(matrix[i][j].id);
                cell.removeEventListener("mousedown", openCell);
                cell.classList.add("bomb");
                cell.classList.add("open");
                matrix[i][j].open = true;
                document.getElementById(cell.id).removeEventListener("mousedown", openCell);
            }
        }
    }
    clearInterval(clock);
}

function openCell(event) {

    if(state == GAME_OVER)
        return;

    let row = event.currentTarget.getAttribute("row");
    let col = event.currentTarget.getAttribute("col");

    if((event.button == "0") && event.currentTarget.classList.contains("flag"))
    {
        return;
    }

    if(event.button == "2"){        
        window.oncontextmenu = (e) => {e.preventDefault();}

        let val = Number(event.currentTarget.classList.toggle("flag"));
        val = val == 1 ? -1 : 1;

        if((flags+val > 10) || (flags+val < 0)){
            event.currentTarget.classList.toggle("flag");
            return;
        }
        else
        {
            flags+= val;
            let set_flags = document.querySelector("#flags");
            set_flags.innerHTML = flags;            
            return;
        }
    }

    if (state == NOT_STARTED) {
        setUserName();
        clock = window.setInterval(updateTime, 1000);
        state = RUNNING;
    }

    event.currentTarget.removeEventListener("mousedown", openCell);
    let counter = document.querySelector("#clicks");
    counter.innerHTML = ++score;
    let c = matrix[row][col];

    if (c.value == 'B') {
        state = GAME_OVER;
        gameLost();
    }
    else if (c.value == 0) {
        openAllAdjacentFreeNeighbours(row, col);
    }
    else if (c.value == 1) {
        event.currentTarget.innerText = matrix[row][col].value;
        event.currentTarget.classList.add("red");
    }
    else if (c.value == 2) {
        event.currentTarget.innerText = matrix[row][col].value;
        event.currentTarget.classList.add("blue");
    }
    else if (c.value == 3) {
        event.currentTarget.innerText = matrix[row][col].value;
        event.currentTarget.classList.add("green");
    }    
    else {
        event.currentTarget.innerText = matrix[row][col].value;
        event.currentTarget.classList.add("yellow");
    }

    matrix[row][col].open = true;
    event.currentTarget.classList.add("open");
    if (c.value != 0)
        hidden--;

    if(hidden == BOMBS)
    {
        gameFinished();
    }

}

function gameLost() {
    showAllBombs();
    let game_over = document.querySelector("#game_over_wrapper");
    game_over.hidden = false;
}

function gameFinished()
{
    showAllBombs();
    let game_over = document.querySelector("#game_finished_wrapper");
    game_over.hidden = false;

    let i = -1;
    scoringList.forEach(function(el, idx){
        if(el.name == username)
            i = idx;
    });

    if(scoringList[i] != undefined)
    {
        if(score < scoringList[i].score)
            scoringList[i].score = score;
    }  
    else
        scoringList.push({"name": username, "score": score})    

    sendDataToServer(JSON.stringify(scoringList));
}

let updateTime = function countSecond() {
    document.getElementById('time').innerText = ++time;
}

function restartGame() {
    location.reload();
}

function setUserName() {
    let loc = sessionStorage.getItem("username");
    if (loc == null || username == "ANONYM") {
        username = prompt("Benutzernamen eingeben");

        if (username.length < 2)
        username = "ANONYM";
        else
        sessionStorage.setItem("username", username);
    }
    else {
        username = loc;
    }
    document.querySelector("#username").innerText = username;
}

function getScoringList() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status == 200) {
            scoringList = JSON.parse(xhr.responseText);
            addDataToDOM();
        }
    };

    xhr.open("GET", "load.php");
    xhr.responseType = "text"
    xhr.setRequestHeader("Accept","text/json");
    xhr.send(null);
}

function addDataToDOM()
{
    let list_node = document.querySelector("#bestenliste");
    let table = document.createElement("table");
    table.createTHead();
    let tbody = table.createTBody();

    scoringList.forEach(function(score)
    {
        let row = document.createElement("tr");
        let name = document.createElement("td");  
        if(score.name == sessionStorage.getItem("username")){
            name.id = "currentplayer";
        }
        let points = document.createElement("td");        
        name.innerText = score.name;
        points.innerText = score.score + " points";
        row.appendChild(name);
        row.appendChild(points);
        tbody.appendChild(row);
    });    
    table.appendChild(tbody);
    list_node.appendChild(table);
}

function sendDataToServer(jsonString) {
    let xhrSend = new XMLHttpRequest();
    
    xhrSend.onload = function () {
        if (xhrSend.status !== 200) return;
        let phpAnswer = JSON.parse(xhrSend.responseText);
    };

    xhrSend.open("POST", "save.php");
    xhrSend.setRequestHeader("Content-Type", "application/json");
    xhrSend.send(jsonString);
}

function saveMatrixToLocalStorage() {
    let jstr = JSON.stringify(matrix);
    localStorage.setItem("matrix", jstr);
    saveMatrixOnServer(jstr);
}

function toggleDebugMode(event)
{
    if(event.button != "2")
        return;
    else
        window.oncontextmenu = (e) => {e.preventDefault();}

    for (let i = 1; i < ROwS-1; i++) {
        for (let j = 1; j < COLUMNS-1; j++) {
            let elem = document.getElementById(matrix[i][j].id);
            if(matrix[i][j].open == false){
                if(debug_mode == false){
                    if(matrix[i][j].value != 0)
                        elem.innerText = matrix[i][j].value;
                }else{
                    elem.innerText = "";
                }
            }
        }
    }
    debug_mode = debug_mode == true ? false : true;
}

