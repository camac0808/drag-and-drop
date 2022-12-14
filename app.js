const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");

let updatedOnLoad = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let listArrays = [];

// get items on localStorage
// console.log(localStorage.getItem("backlogItems"), localStorage.backlogItems) = same value
function getColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    backlogListArray = ["Release course", "Sit back"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Having yourself", "Life is better"];
  }
}

// Set localstorage Arrays
function setColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray];
  const arrayNames = ["backlog", "progress", "complete"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM element for each list item
function createElement(columnList, columnNum, item, index) {
  let listHTML = `<li
  class="drag-item"
  id="${index}"
  ondragstart="drag(event)"
  draggable="true"
  contenteditable="true"
  onfocusout="editItem(${columnNum}, ${index})"
>${item}</li>`;
  columnList.innerHTML += listHTML;

  columnList.setAttribute("ondrop", "drop(event)");
  columnList.setAttribute("ondragover", "allowDrop(event)");
  columnList.setAttribute("ondragenter", `dragEnter(${columnNum})`);
  columnList.id = columnNum;
}

// Filter array to remove empty arrays
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Update columns in DOM
function paintColumns() {
  // updatedOnLoad??? false
  if (!updatedOnLoad) {
    getColumns();
  }
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createElement(backlogList, 0, item, index);
  });
  backlogListArray = filterArray(backlogListArray);

  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createElement(progressList, 1, item, index);
  });
  progressListArray = filterArray(progressListArray);

  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createElement(completeList, 2, item, index);
  });
  completeListArray = filterArray(completeListArray);

  // getColumns ????????? ????????????
  updatedOnLoad = true;
  // paint??? localstorage??? setItems??? ????????? ??????????????? ????????? ?????????
  setColumns();
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  // html collection??? ??????????????? ???????????? ?????? ????????? ???????????? (array-like object) Array.from??? ????????? ????????? ???????????? ??????
  backlogListArray = Array.from(backlogList.children).map((item) => item.textContent);
  progressListArray = Array.from(progressList.children).map((item) => item.textContent);
  completeListArray = Array.from(completeList.children).map((item) => item.textContent);
  paintColumns();
}

let draggedItem;
let dragging = false;
let currentColumn;
// focus out function
function editItem(columnNum, id) {
  let selectedArray = listArrays[columnNum];
  let selectedElement = listColumns[columnNum].children;
  console.log(selectedArray, selectedElement[id].textContent);
  // dragging??? false????????? edit ????????? ??????????????? ???
  if (!dragging) {
    if (!selectedElement[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedElement[id].textContent;
    }
    paintColumns();
  }
}

// drag start function
// drag??? ????????? drop ?????? ?????? appendChild??????
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// drag enter element
function dragEnter(columnNum) {
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  currentColumn = columnNum;
  listColumns[currentColumn].classList.add("over");
}

// dropping item in column
function drop(e) {
  e.preventDefault();
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // e.target?????? ?????? li ????????? ???????????? ????????? ????????????
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

function allowDrop(e) {
  e.preventDefault();
}

// Add to column
function addColumn(columnNum) {
  let inputText = addItems[columnNum].textContent;
  // ????????? ?????? ???????????? ??????
  if (inputText) {
    listArrays[columnNum].push(inputText);
  }
  // inputBox ???????????? ?????????
  addItems[columnNum].textContent = "";
  paintColumns();
}

// show input button
function showInputBox(columnNum) {
  console.log(columnNum);
  addBtns[columnNum].style.visibility = "hidden";
  saveItemBtns[columnNum].style.display = "flex";
  addItemContainers[columnNum].style.display = "flex";
}

// hide input button
function hideInputBox(columnNum) {
  addBtns[columnNum].style.visibility = "visible";
  saveItemBtns[columnNum].style.display = "none";
  addItemContainers[columnNum].style.display = "none";
  addColumn(columnNum);
}

paintColumns();
