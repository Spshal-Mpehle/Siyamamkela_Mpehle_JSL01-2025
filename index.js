// scripts.js (type="module")
const API_URL = "https://jsl-kanban-api.vercel.app/";

// DOM Elements
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");

const todoTasksContainer = document.getElementById("todo-tasks");
const doingTasksContainer = document.getElementById("doing-tasks");
const doneTasksContainer = document.getElementById("done-tasks");

const todoCount = document.getElementById("todo-count");
const doingCount = document.getElementById("doing-count");
const doneCount = document.getElementById("done-count");

const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");

const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskStatusSelect = document.getElementById("task-status");
const taskPrioritySelect = document.getElementById("task-priority");

const saveTaskBtn = document.getElementById("save-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const cancelTaskBtn = document.getElementById("cancel-task-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

const addTaskBtn = document.getElementById("add-task-btn");

const sidebar = document.getElementById("sidebar");
const sidebarHideBtn = document.getElementById("sidebar-hide-btn");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

const sidebarThemeToggle = document.getElementById("sidebar-theme-toggle");
const headerThemeToggle = document.getElementById("header-theme-toggle");

// State
let tasks = [];
let editingTaskId = null;

// Helpers
const saveTasksToLocal = () => {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
};

const loadTasksFromLocal = () => {
  const saved = localStorage.getItem("kanbanTasks");
  return saved ? JSON.parse(saved) : null;
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.className = `task-item priority-${task.priority}`;
  li.tabIndex = 0;
  li.setAttribute("data-id", task.id);
  li.setAttribute("role", "button");
  li.setAttribute("aria-pressed", "false");

  // Title and priority indicator
  li.innerHTML = `
    <strong class="task-title">${task.title}</strong>
    <small class="task-priority">${task.priority}</small>
  `;

  // Click to open modal for editing
  li.addEventListener("click", () => openEditModal(task.id));
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEditModal(task.id);
    }
  });

  return li;
};

const renderTasks = () => {
  // Clear containers
  todoTasksContainer.innerHTML = "";
  doingTasksContainer.innerHTML = "";
  doneTasksContainer.innerHTML = "";

  // Filter tasks by status
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");

  // Append to containers
  todoTasks.forEach((task) =>
    todoTasksContainer.appendChild(createTaskElement(task))
  );
  doingTasks.forEach((task) =>
    doingTasksContainer.appendChild(createTaskElement(task))
  );
  doneTasks.forEach((task) =>
    doneTasksContainer.appendChild(createTaskElement(task))
  );

  // Update counts
  todoCount.textContent = todoTasks.length;
  doingCount.textContent = doingTasks.length;
  doneCount.textContent = doneTasks.length;
};

// Modal functions
const openEditModal = (taskId) => {
  editingTaskId = taskId;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  taskTitleInput.value = task.title;
  taskDescInput.value = task.description || "";
  taskStatusSelect.value = task.status;
  taskPrioritySelect.value = task.priority;

  deleteTaskBtn.style.display = "inline-block";
  taskModal.showModal();
};

const openAddModal = () => {
  editingTaskId = null;

  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskStatusSelect.value = "";
  taskPrioritySelect.value = "";

  deleteTaskBtn.style.display = "none";
  taskModal.showModal();
};

const closeModal = () => {
  taskModal.close();
};

// Save task handler
const handleSaveTask = (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  const status = taskStatusSelect.value;
  const priority = taskPrioritySelect.value;

  if (!title || !status || !priority) {
    alert("Please fill out all required fields.");
    return;
  }

  if (editingTaskId) {
    // Edit existing task
    const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
    if (taskIndex > -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        status,
        priority,
      };
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status,
      priority,
    };
    tasks.push(newTask);
  }

  saveTasksToLocal();
  renderTasks();
  closeModal();
};

// Delete task handler
const handleDeleteTask = () => {
  if (!editingTaskId) return;

  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  tasks = tasks.filter((t) => t.id !== editingTaskId);
  saveTasksToLocal();
  renderTasks();
  closeModal();
};

// Sidebar toggle (desktop)
const toggleSidebar = () => {
  sidebar.classList.toggle("hidden");
};

// Mobile menu toggle
const openMobileMenu = () => {
  sidebar.classList.add("mobile-active");
  mobileMenuOverlay.hidden = false;
  document.body.style.overflow = "hidden";
};

const closeMobileMenu = () => {
  sidebar.classList.remove("mobile-active");
  mobileMenuOverlay.hidden = true;
  document.body.style.overflow = "";
};

// Theme toggle helpers
const applyTheme = (dark) => {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  sidebarThemeToggle.checked = dark;
  headerThemeToggle.checked = dark;
  sidebarThemeToggle.setAttribute("aria-checked", dark);
  headerThemeToggle.setAttribute("aria-checked", dark);
  localStorage.setItem("kanbanTheme", dark ? "dark" : "light");
};

const loadThemeFromLocal = () => {
  const savedTheme = localStorage.getItem("kanbanTheme");
  applyTheme(savedTheme === "dark");
};

// Event Listeners
window.addEventListener("load", () => {
  // Load theme
  loadThemeFromLocal();

  // Load tasks from localStorage or fetch from API
  const savedTasks = loadTasksFromLocal();
  if (savedTasks && savedTasks.length) {
    tasks = savedTasks;
    renderTasks();
  } else {
    fetchTasksFromAPI();
  }
});

const fetchTasksFromAPI = async () => {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (!Array.isArray(data)) throw new Error("Invalid data format");

    tasks = data.map((task) => ({
      id: task.id.toString(),
      title: task.title,
      description: task.description || "",
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
    }));

    saveTasksToLocal();
    renderTasks();
  } catch (error) {
    console.error("Fetch error:", error);
    errorMessage.hidden = false;
  } finally {
    loadingMessage.hidden = true;
  }
};

// Modal buttons
saveTaskBtn.addEventListener("click", handleSaveTask);
deleteTaskBtn.addEventListener("click", handleDeleteTask);
cancelTaskBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

addTaskBtn.addEventListener("click", openAddModal);

sidebarHideBtn.addEventListener("click", toggleSidebar);

mobileMenuBtn.addEventListener("click", openMobileMenu);
mobileMenuOverlay.addEventListener("click", closeMobileMenu);

// Theme toggles
sidebarThemeToggle.addEventListener("change", (e) =>
  applyTheme(e.target.checked)
);
headerThemeToggle.addEventListener("change", (e) =>
  applyTheme(e.target.checked)
);

// Close modal on escape key
taskModal.addEventListener("cancel", (e) => {
  e.preventDefault(); // Prevent default close so we handle custom closing
  closeModal();
});
