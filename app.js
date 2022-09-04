const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const itemLists = document.querySelectorAll(".drag-item-list");
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

// Set localstorage Arrays
function setColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM element for each list item
function createElement(columnList, column, item, index) {
  const listElement = document.createElement("li");
  listElement.classList.add("drag-item");
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

getColumns()
setColumns();
updateDOM();
