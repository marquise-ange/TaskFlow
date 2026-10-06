// TASK DATA
let tasks = [
    {
        id: 1,
        title: "Learn JavaScript",
        completed: false
    },
    {
        id: 2,
        title: "Build my TaskFlow app",
        completed: false
    },
    {
        id: 3,
        title: "Practice responsive CSS",
        completed: true
    }
];

let currentFilter = "all";

// DOM 
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const formMessage = document.querySelector("#form-message");
const loadingState = document.querySelector("#loading-state");
const emptyState = document.querySelector("#empty-state");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const filterButtons = document.querySelectorAll(".filter-button");




// RENDER TASKS
function renderTasks() {
    // Clear the current list
    taskList.innerHTML = "";
    // Get tasks according to the selected filter
    const filteredTasks = getFilteredTasks();
    // Show empty state if there are no tasks
    if (filteredTasks.length === 0) {
        emptyState.hidden = false;
        updateTaskCounter();
        return;
    }

    
    emptyState.hidden = true;  
    filteredTasks.forEach(function(task) {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });

    updateTaskCounter();
}