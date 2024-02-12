const cl = console.log.bind(console);
// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const submit = document.querySelector(".submit-btn");
const item = document.querySelector(".grocery-item");
const form = document.querySelector(".grocery-form");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clear = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clear.addEventListener("click", clearValues);
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createItems(id, value);
    // alert
    displayAlert("item successfully added", "success");
    // add class
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // edit local  storage
    editlocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("empty value", "danger");
  }
}

// alert
function displayAlert(text, type) {
  alert.classList.add(`alert-${type}`);
  alert.textContent = text;
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${type}`);
  }, 1500);
}

// clear btn
function clearValues() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("list emptied succesfully", "success");
  setBackToDefault();
  localStorage.removeItem("list");
}
// deleteBtn
function trash(event) {
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item deleted", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// editBtn
function edit(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submit.textContent = "edit";
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submit.textContent = "Submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  // cl(items);

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editlocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items = items.forEach(function (item) {
      createItems(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
function createItems(id, value) {
  const element = document.createElement("article");
  // create unique attr
  const attr = document.createAttribute("data-id");
  attr.value = id;
  // add attr to element
  element.setAttributeNode(attr);
  // add class
  element.classList.add("grocery-item");
  // add children
  element.innerHTML = `<p class="item">${value}</p>
            <div class="btn-container">
              <button class="edit-btn" type="button">
                <i class=" fas fa-edit"></i>
              </button>
              <button class="delete-btn" type="button">
                <i class=" fas fa-trash"></i>
              </button>
            </div>`;
  // delete & edit btn
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  // event listeners
  deleteBtn.addEventListener("click", trash);
  editBtn.addEventListener("click", edit);
  // appendChild
  list.appendChild(element);
}
