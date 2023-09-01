(function () {
  const obj = localStorage.getItem("date");
  const date2 = {
    all: [],
    deleted: [],
    favorites: [],
  };
  if (obj === null) {
    localStorage.setItem("date", JSON.stringify(date2));
  } else {
    return;
  }
})();
const list = document.getElementById("list");
const menuBtns = document.querySelectorAll(".todolist__btn");

let STATE = "all";
let STATEINNER = "new";

const date = getDateLocalStorage();

const form = document.querySelector(".todolist__form");
const filter = document.querySelectorAll(".filter-btns");
filter.forEach((item) => item.addEventListener("click", funcStateInner));

menuBtns.forEach((item) => {
  item.addEventListener("click", changeTable);
});
form.addEventListener("submit", collectValue);

function collectValue(e) {
  e.preventDefault();
  const input = document.querySelector("#input-add");

  if (input.value === "") {
    return false;
  }
  const item = newItem(input.value, generatorId(), getNewDate());
  addToDate(item);
  clearItems();
  addItems("all");
  input.value = "";
}
function newItem(value, id, date) {
  const objInfo = {
    value,
    id,
    date,
    changed: false,
    checked: false,
    favorite: false,
    deleted: false,
  };

  return objInfo;
}
function generatorId() {
  return Number(new Date());
}
function getNewDate() {
  let day = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  if (Number(day) < 10) {
    day = "0" + day;
  }
  if (Number(month) < 10) {
    month = "0" + month;
  }
  return day + ":" + month + ":" + year;
}
function addToDate(obj, path = "all") {
  date[path].push(obj);
}
function addItems(path = "all") {
  console.log(date);
  let check = "";
  let favoriteCls = "";
  let changed = "";
  date[path].forEach((item) => {
    if (item.checked) {
      check = "checked";
    }
    if (item.favorite) {
      favoriteCls = "todolist__list-item--favorites";
    }
    if (item.changed) {
      changed = "Изменено";
    }
    list.insertAdjacentHTML(
      "afterbegin",
      `
     <li class="todolist__list-item ${favoriteCls}"  id="${item.id}">
     <label class="todolist__label">
         <input type="checkbox" ${check} class="todolist__checkbox display-checkbox">
         <span class="todolist__checkbox-style"></span>
  
         <div class="todolist__text">${item.value}</div>
     </label>
     <input type="text" class="todolist__change-text">
     <div class="todolist__func">
         <div class="todolist__settings">
             <button class="todolist__settings-btn">Настроить</button>
             <ul class="todolist__settings-list">
                 <li class="todolist__settings-item">
                     <button data-settings="favorite"
                         class="todolist__settings-btns todolist__settings-btn-favorites todolist__settings-btns--active">Избранное</button>
                 </li>
                 <li class="todolist__settings-item">
                     <button data-settings="delete" class="todolist__settings-btns">Удалить</button>
                 </li>
                 <li class="todolist__settings-item">
                     <button data-settings="change" class="todolist__settings-btns">Изменить</button>
                 </li>
             </ul>
         </div>
         <div class="todolist__date">
            ${changed} ${item.date}
         </div>
     </div>
  </li>
     `
    );
    check = "";
    favoriteCls = "";
    changed = "";
  });
  addFunctional();
  addToLocalStorage();
}
function clearItems() {
  list.innerHTML = "";
}
function addFunctional() {
  const items = list.querySelectorAll(".todolist__list-item");

  items.forEach((item) => {
    const btnSettings = item.querySelector(".todolist__settings-btn");
    toggleSelect(btnSettings, "todolist__settings-btn--active");

    item
      .querySelector('[data-settings="delete"]')
      .addEventListener("click", deleteItem);

    item
      .querySelector('[data-settings="favorite"]')
      .addEventListener("click", favoriteItem);
    item
      .querySelector('[data-settings="change"]')
      .addEventListener("click", changeItem);
    item
      .querySelector(".todolist__checkbox")
      .addEventListener("input", checkItem);
  });
}
function toggleSelect(item, cls) {
  item.addEventListener("click", () => {
    item.classList.toggle(cls);
  });
}
function deleteItem(e, path = "all") {
  const id = this.closest(".todolist__list-item").id;
  if (STATE === "deleted") {
    date[STATE].forEach((obj, index) => {
      if (Number(obj.id) === Number(id)) {
        date[STATE].splice(index, 1);
      }
    });
  } else {
    date[path].forEach((obj, index) => {
      if (Number(obj.id) === Number(id)) {
        date.all.splice(index, 1);
        obj.favorite = false;
        translateItem(obj, (path = "deleted"));
      }
    });
    date["favorites"].forEach((obj, index) => {
      if (Number(obj.id) === Number(id)) {
        date["favorites"].splice(index, 1);
      }
    });
  }
  clearItems();
  addItems(STATE);
}
function favoriteItem() {
  const id = this.closest(".todolist__list-item").id;
  date[STATE].forEach((obj) => {
    if (Number(obj.id) === Number(id)) {
      if (obj.favorite) {
        obj.favorite = false;
        unFavorite(obj.id);
      } else {
        obj.favorite = true;
        translateItem(obj, "favorites");
      }
    }
  });
  clearItems();
  addItems(STATE);
}
function checkItem() {
  const id = this.closest(".todolist__list-item").id;
  date.all.forEach((obj) => {
    if (Number(obj.id) === Number(id)) {
      obj.checked = !obj.checked;
    }
  });
  clearItems();
  addItems("all");
}
function changeItem(e, path = "all") {
  if (STATE === "deleted") {
    return alert(" в этом разделе невозможно изменить");
  } else {
    const item = this.closest(".todolist__list-item");
    const textItems = item.querySelector(".todolist__text");
    const changeInput = item.querySelector(".todolist__change-text");
    const btn = this;

    if (item.classList.contains("todolist__list-item--change")) {
      const id = this.closest(".todolist__list-item").id;
      date[path].forEach((obj) => {
        if (Number(obj.id) === Number(id)) {
          obj.value = changeInput.value;
          obj.changed = true;
          obj.date = getNewDate();
          textItems.innerText = obj.value;
        }
      });
      btn.innerText = "Изменить";
    } else {
      changeInput.value = textItems.innerText;
      btn.innerText = "Добавить";
    }

    item.classList.toggle("todolist__list-item--change");
  }
}
function translateItem(obj, path = "all") {
  date[path].push(obj);
}
function changeTable() {
  const state = this.getAttribute("data-card");
  STATE = state;
  menuBtns.forEach((item) => item.classList.remove("todolist__btn--active"));
  this.classList.add("todolist__btn--active");
  clearItems();
  addItems(STATE);
}
function unFavorite(id) {
  date["favorites"].forEach((obj, index) => {
    if (Number(obj.id) === Number(id)) {
      date["favorites"].splice(index, 1);
    }
  });
}
function funcStateInner() {
  const filterList = document.querySelector(".todolist__filter-list");
  const atr = this.getAttribute("data-filter");
  let newDate;
  if (this.getAttribute("data-filter") != "") {
    STATEINNER = atr;
    if (STATEINNER === "old") {
      newDate = date[STATE].sort((a, b) => b.id - a.id);
    } else {
      newDate = date[STATE].sort((a, b) => a.id - b.id);
    }
    date[STATE] = newDate;
    clearItems();
    addItems(STATE);
  }

  filterList.classList.toggle("todolist__filter-list--active");
}
function addToLocalStorage() {
  localStorage.setItem("date", JSON.stringify(date));
}
function clearLocalStorage() {
  localStorage.clear();
}
function getDateLocalStorage() {
  return JSON.parse(localStorage.getItem("date"));
}
addItems("all");
