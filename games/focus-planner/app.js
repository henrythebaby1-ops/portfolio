const storageKey = "focus-planner.tasks.v1";
const timerStateKey = "focus-planner.timer.v1";
const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskTitle = document.querySelector("#taskTitle");
const taskPriority = document.querySelector("#taskPriority");
const taskMinutes = document.querySelector("#taskMinutes");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const todayLabel = document.querySelector("#todayLabel");
const timerText = document.querySelector("#timerText");
const activeTaskLabel = document.querySelector("#activeTaskLabel");
const timerProgress = document.querySelector("#timerProgress");
const startPauseTimer = document.querySelector("#startPauseTimer");
const resetTimer = document.querySelector("#resetTimer");
const fiveMinuteTimer = document.querySelector("#fiveMinuteTimer");
const twentyFiveMinuteTimer = document.querySelector("#twentyFiveMinuteTimer");
const openCount = document.querySelector("#openCount");
const doneCount = document.querySelector("#doneCount");
const minutesCount = document.querySelector("#minutesCount");
const progressBar = document.querySelector("#progressBar");

let tasks = readJson(storageKey, [
  {
    id: crypto.randomUUID(),
    title: "Add your first real task",
    priority: "medium",
    minutes: 25,
    done: false,
    createdAt: Date.now()
  }
]);

let currentFilter = "all";
let activeTaskId = null;
let timer = readJson(timerStateKey, {
  duration: 25 * 60,
  remaining: 25 * 60,
  running: false
});

let tickId = null;
const circumference = 2 * Math.PI * 52;

todayLabel.textContent = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric"
}).format(new Date());

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();

  if (!title) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    priority: taskPriority.value,
    minutes: Number(taskMinutes.value) || 25,
    done: false,
    createdAt: Date.now()
  });

  taskForm.reset();
  taskPriority.value = "medium";
  taskMinutes.value = 25;
  persistTasks();
  render();
  taskTitle.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

startPauseTimer.addEventListener("click", () => {
  timer.running = !timer.running;
  persistTimer();
  syncTicker();
  renderTimer();
});

resetTimer.addEventListener("click", () => {
  timer.running = false;
  timer.remaining = timer.duration;
  persistTimer();
  syncTicker();
  renderTimer();
});

fiveMinuteTimer.addEventListener("click", () => setTimerDuration(5));
twentyFiveMinuteTimer.addEventListener("click", () => setTimerDuration(25));

function render() {
  renderTasks();
  renderStats();
  renderTimer();
  syncTicker();
}

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "open") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  if (!visibleTasks.length) {
    taskList.innerHTML = `<li class="empty-state">No tasks here yet.</li>`;
    return;
  }

  taskList.innerHTML = visibleTasks.map((task) => {
    const checked = task.done ? "checked" : "";
    const active = task.id === activeTaskId ? "Stop" : "Focus";
    return `
      <li class="task-item ${task.priority} ${task.done ? "done" : ""}">
        <input class="task-checkbox" type="checkbox" data-action="toggle" data-id="${task.id}" ${checked} aria-label="Mark ${escapeHtml(task.title)} complete">
        <div>
          <span class="task-title">${escapeHtml(task.title)}</span>
          <p class="task-meta">${capitalize(task.priority)} priority · ${task.minutes} min</p>
        </div>
        <button class="mini-button focus-task" type="button" data-action="focus" data-id="${task.id}" aria-label="Focus on ${escapeHtml(task.title)}">${active}</button>
        <button class="mini-button" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete ${escapeHtml(task.title)}">×</button>
      </li>
    `;
  }).join("");

  taskList.querySelectorAll("[data-action]").forEach((control) => {
    control.addEventListener("click", handleTaskAction);
  });
}

function handleTaskAction(event) {
  const id = event.currentTarget.dataset.id;
  const action = event.currentTarget.dataset.action;
  const task = tasks.find((item) => item.id === id);

  if (action === "toggle" && task) {
    task.done = event.currentTarget.checked;
  }

  if (action === "delete") {
    tasks = tasks.filter((item) => item.id !== id);
    if (activeTaskId === id) activeTaskId = null;
  }

  if (action === "focus" && task) {
    activeTaskId = activeTaskId === id ? null : id;
    if (activeTaskId) {
      timer.duration = task.minutes * 60;
      timer.remaining = timer.duration;
      timer.running = false;
    }
  }

  persistTasks();
  persistTimer();
  render();
}

function renderStats() {
  const openTasks = tasks.filter((task) => !task.done);
  const doneTasks = tasks.filter((task) => task.done);
  const plannedMinutes = openTasks.reduce((total, task) => total + task.minutes, 0);
  const completion = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  openCount.textContent = openTasks.length;
  doneCount.textContent = doneTasks.length;
  minutesCount.textContent = plannedMinutes;
  progressBar.style.width = `${completion}%`;
}

function setTimerDuration(minutes) {
  timer = {
    duration: minutes * 60,
    remaining: minutes * 60,
    running: false
  };
  persistTimer();
  renderTimer();
  syncTicker();
}

function renderTimer() {
  const minutes = Math.floor(timer.remaining / 60).toString().padStart(2, "0");
  const seconds = Math.floor(timer.remaining % 60).toString().padStart(2, "0");
  const progress = timer.duration ? timer.remaining / timer.duration : 0;
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  timerText.textContent = `${minutes}:${seconds}`;
  startPauseTimer.textContent = timer.running ? "Pause" : "Start";
  activeTaskLabel.textContent = activeTask ? activeTask.title : "Pick a task";
  timerProgress.style.strokeDasharray = circumference;
  timerProgress.style.strokeDashoffset = circumference * (1 - progress);
}

function syncTicker() {
  clearInterval(tickId);

  if (!timer.running) return;

  tickId = setInterval(() => {
    timer.remaining = Math.max(0, timer.remaining - 1);

    if (timer.remaining === 0) {
      timer.running = false;
      clearInterval(tickId);
    }

    persistTimer();
    renderTimer();
  }, 1000);
}

function persistTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function persistTimer() {
  localStorage.setItem(timerStateKey, JSON.stringify(timer));
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

render();
