let allTasks = [];
let valueInput = "";
let input = null;

// после загрузки всех элементов
window.onload = async function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  })
  let result = await resp.json()
  allTasks = result.data
  console.log(allTasks)
  render()
};
//кнопка Add
onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck:false
    })
  })
  let result = await resp.json()
  allTasks = result.data
  valueInput = "";
  input.value = "";
  render();
};
// по нажатию в input
updateValue = (event) => {
  valueInput = event.target.value;
};

//удаление всех задач из списка
onClickRemove = () =>{
    allTasks = []
    render()
}

// отрисовка задач
render = () => {
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onclick = function () {
      onClickCheckBox(index);
    };
    container.appendChild(checkbox);
    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "text-task done-text" : "text-task";
    container.appendChild(text);

    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.svg";
    imageEdit.className = "img-edit";
    container.appendChild(imageEdit);
    const imageDelete = document.createElement("img");
    imageDelete.src = "images/delete-icon.svg";
    imageDelete.className = "img-edit";
    container.appendChild(imageDelete);

    content.appendChild(container);
    //удаление элемента
    imageDelete.onclick = () => onClickDelete(item.id);

    //редактирование элемента
    imageEdit.onclick = () => {
      const buttonDisable = document.querySelector('button')
      buttonDisable.setAttribute("disabled", "disabled");
      checkbox.style.display = "none";
      text.style.display = "none";
      imageEdit.style.display = "none";
      imageDelete.style.display = "none";
      let inputEdit = document.createElement("input");
      inputEdit.id = `input-${index}`;
      inputEdit.value = item.text;
      const imageOk = document.createElement("img");
      imageOk.className = "img-edit";
      imageOk.src = "images/ok.svg";
      container.appendChild(inputEdit);
      container.appendChild(imageOk);
      //кнопка галочка
      imageOk.onclick = () => {
        onClickEdit(item.id,inputEdit.value);
        buttonDisable.removeAttribute("disabled");
      };
    };
  });
};
// меняет значение checkbox при нажатии на противовположное
onClickCheckBox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  render();
};
//возвращает массив где индекс не равен передаваемому индексу
onClickDelete = async (value) => {

  console.log(value,'value')
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${value}`, {
    method: 'DELETE',
  })
  let result = await resp.json()
  allTasks = result.data
  console.log('Удалено')
 
  render();
};
// редактирует элемент меня значение .text
onClickEdit = async (value,newText) => {
  // const editedValue = document.getElementById(`input-${index}`).value;
  // allTasks[index].text = editedValue;
  // render();

  const resp = await fetch(`http://localhost:8000/updateTask?id=${value}`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id:value,
      text:newText,
      isCheck:false
    })
  })
  let result = await resp.json()
  allTasks = result.data
  console.log('Изменено')
 
  render();
};


