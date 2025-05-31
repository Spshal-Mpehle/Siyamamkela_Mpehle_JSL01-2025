import { initialTasks as fetchTaskFromAPI } from "./initialData.js";

let currentTasks = [];
let currentTask = null;
let lastFocusedElement = null;

async function initApp() {
  try {
    const kanbanData = await fetchTaskFromAPI();
    localStorage.setItem("kanbanTasks", JSON.stringify(kanbanData));
    currentTasks = kanbanData;
    clearExistingTasks();
    renderTasks(currentTasks);
    setupModalCloseHandler();
    setupThemeToggle();
  } catch (error) {
    alert("Failed to initialize the Kanban board: " + error.message);
    console.error("Initialization Error:", error);
  }

  document
    .getElementById("add-task-btn")
    .addEventListener("click", openNewTaskModal);
  document.getElementById("edit-btn").addEventListener("click", () => {
    if (currentTask) openTaskModal(currentTask);
  });

  document
    .getElementById("task-form")
    .addEventListener("submit", handleTaskSave);
  document
    .getElementById("delete-task-btn")
    .addEventListener("click", handleTaskDelete);

  document
    .getElementById("task-form")
    .addEventListener("submit", handleTaskSave);
  document
    .getElementById("delete-task-btn")
    .addEventListener("click", handleTaskDelete);
}

document
  .getElementById("add-task-btn")
  .addEventListener("click", openNewTaskModal);
document.getElementById("edit-btn").addEventListener("click", () => {
  if (currentTask) openTaskModal(currentTask);
});

function openNewTaskModal() {
  currentTask = null;
  const modal = document.getElementById("task-modal");
  document.getElementById("modal-title").textContent = "Add Task";
  document.getElementById("task-title").value = "";
  document.getElementById("task-desc").value = "";
  document.getElementById("task-status").value = "todo";
  document.getElementById("task-priority").value = "medium";
  modal.showModal();
  document.getElementById("task-title").focus();
}

function handleTaskSave(event) {
  event.preventDefault(); // Prevent form from closing automatically

  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;

  if (!title) {
    alert("Title is required");
    return;
  }

  if (currentTask) {
    // Edit existing task
    currentTask.title = title;
    currentTask.description = description;
    currentTask.status = status;
    currentTask.priority = priority;
  } else {
    // Add new task
    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
      priority,
    };
    currentTasks.push(newTask);
  }

  // Save and re-render
  localStorage.setItem("kanbanTasks", JSON.stringify(currentTasks));
  clearExistingTasks();
  renderTasks(currentTasks);
  document.getElementById("task-modal").close();
}

function renderTasks(tasks) {
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
}

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;
  taskDiv.setAttribute("role", "button");
  taskDiv.setAttribute("tabindex", "0");
  taskDiv.setAttribute("aria-label", `View task: ${task.title}`);

  // Accessibility: open modal via click or Enter key
  taskDiv.addEventListener("click", () => openTaskModal(task));
  taskDiv.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      openTaskModal(task);
    }
  });

  return taskDiv;
}

function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

function openTaskModal(task) {
  currentTask = task;
  const modal = document.getElementById("task-modal");

  // Remember the element that opened the modal (for focus restoration)
  lastFocusedElement = document.activeElement;

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description || "";
  document.getElementById("task-status").value = task.status;

  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("role", "dialog");
  modal.showModal();

  // Focus on the first input
  document.getElementById("task-title").focus();
}

function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-button");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.close();
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  // Return focus to the last focused element on close
  modal.addEventListener("close", () => {
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  });
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme on load
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (toggle) toggle.checked = true;
  }

  if (toggle) {
    toggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }
}

// Initialize the app when DOM is fully ready
document.addEventListener("DOMContentLoaded", initApp);
