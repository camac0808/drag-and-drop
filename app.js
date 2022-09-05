const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// items
let updatedOnLoad = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// get items on localStorage
function getColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    // array value
    backlogListArray = ["Release course", "Sit back"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Having yourself", "Life is better"];
    onHoldListArray = ["Learn like a professional"];
  }
}

// console.log(localStorage.getItem("backlogItems"), localStorage.backlogItems) = same value

// Set localstorage Arrays
function setColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM element for each list item
function createElement(columnList, columnNum, item, index) {
  const listElement = document.createElement("li");
  listElement.classList.add("drag-item");
  listElement.draggable = true;
  listElement.setAttribute("ondragstart", "drag(event)");

  columnList.setAttribute("ondrop", "drop(event)");
  columnList.setAttribute("ondragover", "allowDrop(event)");
  columnList.setAttribute("ondragenter", `dragEnter(${columnNum})`);
  columnList.id = columnNum;

  listElement.textContent = item;
  columnList.appendChild(listElement);
}

// Update columns in DOM
function updateDOM() {
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createElement(backlogList, 0, item, index);
  });

  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createElement(progressList, 1, item, index);
  });

  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createElement(completeList, 2, item, index);
  });

  onHoldList.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createElement(onHoldList, 3, item, index);
  });
}

let draggedItem;
let currentColumn;

// drag start function
function drag(e) {
  draggedItem = e.target;
  console.log(draggedItem);
}

// dropping item in column
function drop(e) {
  e.preventDefault();
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(columnNum) {
  listColumns.forEach((column) => {
    column.classList.remove("over");
  })

  currentColumn = columnNum;
  listColumns[currentColumn].classList.add("over");
}



getColumns();
setColumns();
updateDOM();
