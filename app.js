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
  // updatedOnLoad가 false
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

  // getColumns 한번만 작동하게
  updatedOnLoad = true;
  // paint후 localstorage에 setItems를 해줘야 새로고침시 초기화 안된다
  setColumns();
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  // html collection은 브라우저의 기술이지 실제 배열은 아니므로 (array-like object) Array.from을 통해서 배열로 만들어야 한다
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
  // dragging이 false일때만 edit 수정이 가능하다는 뜻
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
// drag한 요소를 drop 함수 안에 appendChild한다
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
  // e.target으로 하면 li 안에도 들어가는 현상이 나타난다
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
  // 내용이 있을 경우에만 추가
  if (inputText) {
    listArrays[columnNum].push(inputText);
  }
  // inputBox 빈칸으로 초기화
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
