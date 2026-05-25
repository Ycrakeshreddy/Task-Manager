let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentUser = localStorage.getItem("user");

// AUTO LOGIN CHECK
if (currentUser) {
    showDashboard();
} else {
    showLogin();
}

/* ---------------- LOGIN ---------------- */
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user && pass) {
        localStorage.setItem("user", user);
        showDashboard();
    } else {
        alert("Enter login details");
    }
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

/* ---------------- UI SWITCH ---------------- */
function showLogin() {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
}

function showDashboard() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    displayTasks();
}

/* ---------------- ADD TASK ---------------- */
function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    tasks.push({
        text: input.value,
        completed: false
    });

    input.value = "";
    save();
}

/* ---------------- DISPLAY ---------------- */
function displayTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        list.innerHTML += `
        <li draggable="true" ondragstart="drag(event, ${index})" ondrop="drop(event, ${index})" ondragover="allowDrop(event)">
            
            <span class="task-text ${task.completed ? "completed" : ""}"
                  contenteditable="true"
                  onblur="updateText(${index}, this.innerText)">
                ${task.text}
            </span>

            <div class="actions">
                <button class="done" onclick="toggle(${index})">Done</button>
                <button class="update" onclick="saveEdit(${index})">Update</button>
                <button class="delete" onclick="remove(${index})">Delete</button>
            </div>
        </li>`;
    });
}

/* ---------------- UPDATE TEXT (CLICK TO EDIT) ---------------- */
function updateText(index, value) {
    if (value.trim() === "") return;
    tasks[index].text = value.trim();
    save();
}

function saveEdit(index) {
    save(); // manual update button
}

/* ---------------- TOGGLE COMPLETE ---------------- */
function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    save();
}

/* ---------------- DELETE ---------------- */
function remove(i) {
    tasks.splice(i, 1);
    save();
}

/* ---------------- DRAG & DROP ---------------- */
let draggedIndex = null;

function drag(event, index) {
    draggedIndex = index;
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, index) {
    event.preventDefault();

    const temp = tasks[draggedIndex];
    tasks.splice(draggedIndex, 1);
    tasks.splice(index, 0, temp);

    save();
}

/* ---------------- SAVE ---------------- */
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}