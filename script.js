const getById = (id) => document.getElementById(id);

const getItemOnLocalStorage = (item) => window.localStorage.getItem(item);

const addEvent = (element, eventType, callback) => {
  element.addEventListener(eventType, callback);
};

const colorIsSelected = 'rgb(128, 128, 128)';
const listSaved = [];
const taskInput = getById('texto-tarefa');
const taskList = getById('lista-tarefas');

const addTaskInTheList = (element, data, classData) => {
  const newTask = document.createElement('li');
  newTask.innerText = data;
  newTask.className = classData;
  element.appendChild(newTask);
  taskInput.value = '';
};

const setInitialList = (list) => {
  list = list.split(',');
  if (list.length > 1) {
    for (let index = 0; index < list.length; index += 2) {
      addTaskInTheList(taskList, list[index], list[index + 1]);
    }
  }
};

const clearBgColor = (element) => {
  for (let index = 0; index < element.children.length; index += 1) {
    element.children[index].style.backgroundColor = '';
  }
};

const paintBackground = (item) => {
  if (item.id !== 'lista-tarefas') {
    item.style.backgroundColor = colorIsSelected;
  }
};

const completedTask = (task) => {
  if (task.id !== 'lista-tarefas') {
    if (task.className === 'completed') {
      task.className = '';
    } else {
      task.className = 'completed';
    }
  }
};

const clearTaskList = (element) => {
  for (let index = element.children.length - 1; index >= 0; index -= 1) {
    element.removeChild(element.children[index]);
  }
};

const removeFinalized = (element) => {
  for (let index = element.children.length - 1; index >= 0; index -= 1) {
    if (element.children[index].className === 'completed') {
      element.removeChild(element.children[index]);
    }
  }
};

const saveListOnLocalStorage = (element) => {
  for (let index = 0; index < element.children.length; index += 1) {
    listSaved.push(
      element.children[index].innerText,
      element.children[index].className
    );
  }
  window.localStorage.setItem('list', listSaved);
};

// função copiada de: https://www.codegrepper.com/code-examples/javascript/change+position+of+element+in+array+javascript
const moveElement = (array, initialIndex, finalIndex) => {
  array.splice(finalIndex, 0, array.splice(initialIndex, 1)[0]);
  return array;
};

const newPositionUp = (element) => {
  let newPositionArr = [];
  for (let index = 0; index <= element.length - 1; index += 1) {
    if (
      element[index].style.backgroundColor === colorIsSelected &&
      index !== 0
    ) {
      newPositionArr = moveElement([...element], index, index - 1);
      clearTaskList(taskList);
    }
  }
  return newPositionArr;
};

const newPositionDown = (element) => {
  let newPositionArr = [];
  for (let index = 0; index < element.length; index += 1) {
    if (
      element[index].style.backgroundColor === colorIsSelected &&
      index !== element.length - 1
    ) {
      newPositionArr = moveElement([...element], index + 1, index);
      clearTaskList(taskList);
    }
  }
  return newPositionArr;
};

const moveItem = (element, arr) => {
  for (let index = 0; index < arr.length; index += 1) {
    element.appendChild(arr[index]);
  }
};

const removeItemSelected = (element) => {
  for (let index = 0; index < element.children.length; index += 1) {
    if (element.children[index].style.backgroundColor === colorIsSelected) {
      element.removeChild(element.children[index]);
    }
  }
};

addEvent(getById('criar-tarefa'), 'click', () => {
  addTaskInTheList(taskList, taskInput.value, '');
});

addEvent(taskInput, 'keydown', (event) => {
  if (event.key === 'Enter') {
    addTaskInTheList(taskList, taskInput.value, '');
  }
});

addEvent(getById('remover-finalizados'), 'click', () => {
  removeFinalized(taskList);
});

addEvent(getById('apaga-tudo'), 'click', () => clearTaskList(taskList));

addEvent(taskList, 'click', (event) => {
  clearBgColor(taskList);
  paintBackground(event.target);
});

addEvent(taskList, 'dblclick', (event) => completedTask(event.target));

addEvent(getById('salvar-tarefas'), 'click', () => {
  saveListOnLocalStorage(taskList);
});

addEvent(window, 'load', () => {
  if (getItemOnLocalStorage('list') == null) {
    window.localStorage.setItem('list', '');
  }
  setInitialList(getItemOnLocalStorage('list'));
});

addEvent(getById('mover-cima'), 'click', () => {
  moveItem(taskList, newPositionUp(taskList.children));
});

addEvent(getById('mover-baixo'), 'click', () => {
  moveItem(taskList, newPositionDown(taskList.children));
});

addEvent(getById('remover-selecionado'), 'click', () => {
  removeItemSelected(taskList);
});
