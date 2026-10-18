
const initialTasks = [
  { id: 1, title: "Learn JavaScript basics", completed: false },
  { id: 2, title: "Understand APIs", completed: false },
  { id: 3, title: "Review Git basics", completed: false }
];

let tasks = initialTasks.map(task => ({ ...task }));
let nextId = 4;

const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const percentage = document.querySelector("#percentage");
const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");
const resetButton = document.querySelector("#reset-button");
const loadTaskButton = document.querySelector("#load-task-button");
const apiResult = document.querySelector("#api-result");
const addApiTaskButton = document.querySelector("#add-api-task-button");

let apiTaskTitle = "";

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.title}`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const title = document.createElement("span");
    title.textContent = task.title;

    li.append(checkbox, title);
    taskList.appendChild(li);
  });
  //const completed = tasks.filter(task => task.complete).length;

  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round(completed / total * 100);

  percentage.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${completed} of ${total} tasks completed`;
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: nextId++,
    title,
    completed: false
  });

  taskInput.value = "";
  renderTasks();
});

resetButton.addEventListener("click", () => {
  tasks = initialTasks.map(task => ({ ...task }));
  nextId = 4;
  renderTasks();
});

renderTasks();

loadTaskButton.addEventListener("click", async () => {
  apiResult.textContent = "Loading...";
  addApiTaskButton.hidden = true;
  apiTaskTitle = "";
  loadTaskButton.disabled = true;

  try {
    const response = await fetch(
  "https://jsonplaceholder.typicode.com/todos/1");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    apiTaskTitle = data.title;

    apiResult.textContent = apiTaskTitle;
    addApiTaskButton.hidden = false;
  } catch (error) {
    apiResult.textContent = "Could not load task. Please try again.";
  } finally {
    loadTaskButton.disabled = false;
  }
});

addApiTaskButton.addEventListener("click", () => {
  if (!apiTaskTitle) return;

  tasks.push({
    id: nextId++,
    title: apiTaskTitle,
    completed: false
  });

  apiTaskTitle = "";
  apiResult.textContent = "Task added to tracker!";
  addApiTaskButton.hidden = true;

  renderTasks();
});

