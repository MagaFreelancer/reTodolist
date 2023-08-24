const list = document.getElementById("list");
const date = {
  all: [],
  deleted: [],
  favorites: [],
};
const form = document.querySelector(".todolist__form");

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
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  return day + ":" + month + ":" + year;
}
function addToDate(obj, path = "all") {
  date[path].push(obj);
}
function addItems(path = "all") {
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
  });
  addFunctional();
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
function deleteItem() {
  const id = this.closest(".todolist__list-item").id;
  date.all.forEach((obj, index) => {
    if (Number(obj.id) === Number(id)) {
      date.all.splice(index, 1);
    }
  });
  clearItems();
  addItems("all");
}
function favoriteItem() {}
function checkItem() {}
function changeItem() {}
