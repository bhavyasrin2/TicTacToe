var board;
const human = "O";
const ai = "X";

const winchances = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const boxes = document.querySelectorAll(".box");

function play() {
  document.querySelector(".display").style.display = "none";
  board = Array.from(Array(9).keys());
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].innerHTML = "";
    boxes[i].style.removeProperty("background-color");
    boxes[i].addEventListener("click", editcell, false);
  }
}

function editcell(block) {
  if (typeof board[block.target.id] === "number") {
    edit(block.target.id, human);
    if (!Tie() && !checkWin(board, human)) {
      edit(bestIndex(), ai);
    }
  }
}

function edit(editid, player) {
  board[editid] = player;
  document.getElementById(editid).innerHTML = player;
  let check = checkWin(board, player);
  if (check) gamewon(check);
}

function checkWin(boardCopy, player) {
  let plays = boardCopy.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    []
  );
  let check = null;
  for (let [index, arrplays] of winchances.entries()) {
    if (arrplays.every((elem) => plays.indexOf(elem) > -1)) {
      check = { index: index, player: player };
    }
  }
  return check;
}

function gamewon(check) {
  let color;
  if (check.player === "O") {
    color = "#8dacbe";
  } else {
    color = "#7c6f5f";
  }

  for (let index of winchances[check.index]) {
    document.getElementById(index).style.backgroundColor = color;
  }
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].removeEventListener("click", editcell, false);
  }
  displayText(check.player === human ? "HUMAN WINS.." : "AI WINS..");
}
function displayText(text) {
  document.querySelector(".display").style.display = "flex";
  document.querySelector(".display").style.justifyContent = "center";
  document.querySelector(".display").style.alignItems = "center";
  document.querySelector(".display .text").innerHTML = text;
}

function Tie() {
  if (checkcells().length == 0) {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].style.backgroundColor = "#b5ddf5";
      boxes[i].removeEventListener("click", editcell, false);
    }
    displayText("TIE GAME..");
    return true;
  }
  return false;
}

function checkcells() {
  return board.filter((s) => typeof s === "number");
}

function bestIndex() {
  return minmax(board, ai).index;
}

function minmax(boardCopy, player) {
  var emptySpots = checkcells(boardCopy);
  if (checkWin(boardCopy, player)) {
    return { score: -10 };
  } else if (checkWin(boardCopy, ai)) {
    return { score: 20 };
  } else if (emptySpots.length == 0) {
    return { score: 0 };
  }
  var movesList = [];
  for (var i = 0; i < emptySpots.length; i++) {
    var move = {};
    move.index = boardCopy[emptySpots[i]];
    board[emptySpots[i]] = player;
    if (player === human) {
      var result = minmax(boardCopy, ai);
      move.score = result.score;
    } else if (player === ai) {
      var result = minmax(boardCopy, human);
      move.score = result.score;
    }
    board[emptySpots[i]] = move.index;
    movesList.push(move);
  }
  var BestMove;
  if (player == ai) {
    var BestScore = -1000;
    for (var i = 0; i < movesList.length; i++) {
      if (movesList[i].score > BestScore) {
        BestScore = movesList[i].score;
        BestMove = i;
      }
    }
  } else {
    var BestScore = 1000;
    for (var i = 0; i < movesList.length; i++) {
      if (movesList[i].score < BestScore) {
        BestScore = movesList[i].score;
        BestMove = i;
      }
    }
  }
  return movesList[BestMove];
}
