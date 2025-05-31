import { initialTasks } from "./initialData.js";

async function initApp() {
    try {
      const kanbanData = await initalTasks();
      console.log("Kanban Data:", kanbanData);
    } catch (error) {
      alert("Failed to initialize the Kanban board: " + error.message);
      console.error("Initialization Error:", error);
    }
  }

  function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-div";
    taskDiv.textContent = task.title;
    taskDiv.dataset.taskId = task.id;
    taskDiv.addEventListener("click", () => openTaskModal(task));
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






/**
 * Creates a single task DOM element.
 * @param {Object} task - Task data object.
 * @param {string} task.title - Title of the task.
 * @param {number} task.id - Unique task ID.
 * @param {string} task.status - Status column: 'todo', 'doing', or 'done'.
 * @returns {HTMLElement} The created task div element.
 */

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Finds the task container element based on task status.
 * @param {string} status - The task status ('todo', 'doing', or 'done').
 * @returns {HTMLElement|null} The container element, or null if not found.
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clears all existing task-divs from all task containers.
 */
function clearExistingTasks() {
    document.querySelectorAll(".tasks-container").forEach((container) => {
      container.innerHTML = "";
    });
  }

/**
 * Renders all tasks from initial data to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
    tasks.forEach((task) => {
      const container = getTaskContainerByStatus(task.status);
      if (container) {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
      }
    });
  }

  /**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */

  function openTaskModal(task) {
    const modal = document.getElementById("task-modal");
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-status").value = task.status;
    modal.showModal();
  }



// Toggle theme
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});

/**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */

function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  modal.showModal();
}

/**
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
    const modal = document.getElementById("task-modal");
    const closeBtn = document.getElementById("close-modal-button");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  }
  
  function setupModalCloseHandler() {
    const modalCloseButton = document.querySelector("#modalClose"); // Update selector as needed
    if (modalCloseButton) {
      modalCloseButton.addEventListener("click", () => {
        console.log("Modal closing...");
      });
    }
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}

/**
 * Initializes the task management UI.
 */
function initalTasks() {
  clearExistingTasks();
  renderTasks(initialTasks);
  setupModalCloseHandler();
}
// Initialize the task management system when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialTasks);
