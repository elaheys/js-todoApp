const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const editButton = document.getElementById("edit-button");
const filterButtons = document.querySelectorAll(".filter-todos");


let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
    localStorage.setItem("todos" , JSON.stringify(todos))
}

const generateId = () => {
    return Math.round(Math.random() * Math.random() * Math.pow(10 , 15)).toString();
}


const deleteAllHandler = () =>{
    if(todos.length){
        todos = [];
        saveToLocalStorage();
        displayTodos();
        showAlert("All todos cleared successfully" , "success")

    }else{
        showAlert("No todos to clear!" , "error")
    }
}



const showAlert = (message,type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.appendChild(alert);

    setTimeout(() => {
        alert.style.display = "none";
    },2000)
}

const displayTodos = (data) =>{
    const todoList = data || todos;
    todosBody.innerHTML = "";
    if(!todoList.length){
        todosBody.innerHTML = "<tr><td colspan='4'>No Task found!</td></tr>";
        return;
    }

    todoList.forEach(todo => {
            todosBody.innerHTML += `
                <tr>
                    <td>${todo.task}</td>
                    <td>${todo.date}</td>
                    <td>${todo.completed ? "Completed" : "Pending"}</td>
                    <td>
                        <button onclick="editHandler('${todo.id}')">Edit</button>
                        <button onclick="toggleHandler('${todo.id}')">${todo.completed ? "Undo" : "Do"}</button>
                        <button onclick="deleteHandler('${todo.id}')">Delete</button>
                    </td>
                </tr>
            `
        });
}

const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id:generateId(),
        task,
        date,
        completed:false
    }

    if(task && date){
        todos.push(todo);
        saveToLocalStorage();
        displayTodos()
        taskInput.value = "";
        dateInput.value = "";
        showAlert("Task Added Successfully" , "success");
    }else if(task && !date){
        const nowDate = new Date().toLocaleDateString("en-CA");
        todos.push({...todo, date: nowDate});
        saveToLocalStorage();
        displayTodos()
        taskInput.value = "";
        dateInput.value = "";
        showAlert("Task Added Successfully" , "success");
    }else{
        showAlert("Please Enter A Task" , "error");
    }
}

const deleteHandler = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displayTodos();
    showAlert("todo delete successfully!" , "success")
}

const toggleHandler = (id) => {
        const newTodos = todos.find(todo => todo.id === id);
        newTodos.completed = !newTodos.completed;
        saveToLocalStorage();
        displayTodos();
        showAlert("todos change successfully!" , "success");
}

const editHandler = (id) => {
    const newTodo = todos.find(todo => todo.id === id);
    taskInput.value = newTodo.task;
    dateInput.value = newTodo.date;
    editButton.style.display = "inline-block";
    addButton.style.display = "none";
    editButton.dataset.id = id;
}


const applyEditHandler = (event) =>{
    const id = event.target.dataset.id;
    const newTodo = todos.find(todo => todo.id === id);
    newTodo.task = taskInput.value
    newTodo.date = dateInput.value
    taskInput.value = "";
    dateInput.value = "";
    addButton.style.display = "inline-block";
    editButton.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo Edited successfully!" , "success");
}

const changeClass = (filter) => {
    filterButtons.forEach(button => {
        if(button.dataset.filter === filter){
            button.classList.add("selected")
        }else{
            button.classList.remove("selected")
        }
    })
}

const filterHandler = (event) => {
    let filterTodos = null
    const filter = event.target.dataset.filter;
    if(filter === "pending" ){
        filterTodos = todos.filter(todo => todo.completed === false)
        changeClass(filter)
    }else if(filter === "completed"){
        filterTodos = todos.filter(todo => todo.completed === true)
        changeClass(filter)
    }else {
        filterTodos = todos
        changeClass(filter)
    }
    displayTodos(filterTodos)
    
}


window.addEventListener("load" , () => displayTodos())
addButton.addEventListener("click" , addHandler);
deleteAllButton.addEventListener("click" ,deleteAllHandler);
editButton.addEventListener("click",applyEditHandler);
filterButtons.forEach(button => {
    button.addEventListener("click",filterHandler)
})


