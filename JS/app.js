
// FIREBASE CONNECTION
import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// APPLICATION STATE
let tasks = [];
let currentFilter = "all";

// DOM ELEMENTS

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const formMessage = document.querySelector("#form-message");
const emptyState = document.querySelector("#empty-state");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const filterButtons = document.querySelectorAll(".filter-button");


// LOAD TASKS FROM FIRESTORE
async function loadTasks() {
    try {

        // Hide previous error
        errorState.hidden = true;

        // Get the tasks collection
        const tasksCollection = collection(db, "tasks");

        // Get newest tasks first
        const tasksQuery = query(
            tasksCollection,
            orderBy("createdAt", "desc")
        );

        // Get tasks from Firestore
        const snapshot = await getDocs(tasksQuery);

        // Convert Firestore documents into JavaScript objects
        tasks = snapshot.docs.map(function(document) {

            return {
                id: document.id,
                ...document.data()
            };

        });

        // Display tasks
        renderTasks();

    } catch (error) {

        console.error("Error loading tasks:", error);

        errorMessage.textContent =
            "We couldn't load your tasks. Please try again.";

        errorState.hidden = false;
    }
}

// RENDER TASKS
function renderTasks() {

    // Clear existing tasks
    taskList.innerHTML = "";

    // Get tasks for selected filter
    const filteredTasks = getFilteredTasks();


    // Show empty state if there are no tasks
    if (filteredTasks.length === 0) {
        emptyState.hidden = false;
        updateTaskCounter();
        return;
    }


    // Hide empty state
    emptyState.hidden = true;


    // Display each task
    filteredTasks.forEach(function(task) {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });

    // Update task counter
    updateTaskCounter();
}

// FILTER TASKS
function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(function(task) {
            return !task.completed;
        });
    }


    if (currentFilter === "completed") {
        return tasks.filter(function(task) {
            return task.completed;

        });
    }


    // Show all tasks
    return tasks;
}

// CREATE TASK ELEMENT

function createTaskElement(task) {

    // Create list item
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.dataset.id = task.id;


    // Add completed class
    if (task.completed) {

        listItem.classList.add("completed");

    }

    // CHECKBOX

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.title}" as complete`
    );


    // TASK TITLE

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;


    // ACTION BUTTONS

    const actions = document.createElement("div");
    actions.className = "task-actions";


    // Edit button
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "task-action edit";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.setAttribute(
        "aria-label",
        `Edit "${task.title}"`
    );


    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-action delete";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute(
        "aria-label",
        `Delete "${task.title}"`
    );


    // Add buttons
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    // Add elements to task
    listItem.appendChild(checkbox);
    listItem.appendChild(title);
    listItem.appendChild(actions);


    return listItem;
}

// ADD TASK
async function addTask(title) {
    const trimmedTitle = title.trim();

    // Validate empty title
    if (trimmedTitle === "") {
        showFormMessage(
            "Please enter a task.",
            "error"
        );

        return;
    }

    // Validate title length
    if (trimmedTitle.length > 100) {
        showFormMessage(
            "Task must be 100 characters or less.",
            "error"
        );

        return;
    }

    const addButton = taskForm.querySelector(".add-button");
    try {

        // Disable button while saving
        addButton.disabled = true

        // Save task to Firestore
        await addDoc(
            collection(db, "tasks"),
            {
                title: trimmedTitle,
                completed: false,
                createdAt: serverTimestamp()
            }
        );

        // Clear input
        taskInput.value = "";
        clearFormMessage();

        // Reload tasks
        await loadTasks();

        // Return focus to input
        taskInput.focus();
    } catch (error) {
        console.error("Error adding task:", error);
        showFormMessage(
            "We couldn't add your task. Please try again.",
            "error"
        );

    } finally {

        // Enable button again
        addButton.disabled = false;
    }
}

// TOGGLE TASK
async function toggleTask(taskId) {
    const task = tasks.find(function(task) {
        return task.id === taskId;
    });


    if (!task) {
        return;
    }

    try {

        // Update completed status
        await updateDoc(
            doc(db, "tasks", taskId),
            {
                completed: !task.completed
            }
        );


        // Reload tasks
        await loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
        showFormMessage(
            "We couldn't update your task. Please try again.",
            "error"
        );
    }
}

// EDIT TASK

async function editTask(taskId) {
    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (!task) {
        return;
    }


    // Ask for new task title
    const newTitle = prompt(
        "Edit your task:",
        task.title
    );


    // User cancelled
    if (newTitle === null) {
        return;
    }

    const trimmedTitle = newTitle.trim();
    // Validate empty title
    if (trimmedTitle === "") {
        showFormMessage(
            "Task title cannot be empty.",
            "error"
        );

        return;
    }


    // Validate title length
    if (trimmedTitle.length > 100) {
        showFormMessage(
            "Task must be 100 characters or less.",
            "error"
        );
        return;
    }


    try {

        // Update task title
        await updateDoc(
            doc(db, "tasks", taskId),
            {
                title: trimmedTitle
            }
        );

        clearFormMessage();

        // Reload tasks
        await loadTasks();

    } catch (error) {
        console.error("Error editing task:", error);
        showFormMessage(
            "We couldn't edit your task. Please try again.",
            "error"
        );
    }
}

// DELETE TASK
async function deleteTask(taskId) {
    const task = tasks.find(function(task) {
        return task.id === taskId;

    });


    if (!task) {
        return;
    }


    // Confirm deletion
    const confirmed = confirm(
        `Are you sure you want to delete "${task.title}"?`
    );


    if (!confirmed) {
        return;
    }


    try {

        // Delete task from Firestore
        await deleteDoc(
            doc(db, "tasks", taskId)
        );


        // Reload tasks
        await loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        showFormMessage(
            "We couldn't delete your task. Please try again.",
            "error"
        );
    }
}

// UPDATE TASK COUNTER
function updateTaskCounter() {
    const activeTasks = tasks.filter(function(task) {
        return !task.completed;
    });


    const count = activeTasks.length;
    if (count === 1) {
        taskCounter.textContent = "1 task left";
    } else {
        taskCounter.textContent = `${count} tasks left`;

    }
}

// FORM MESSAGES
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}


function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

// ADD TASK FORM EVENT
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addTask(taskInput.value);

});

// TASK BUTTON EVENTS
taskList.addEventListener("click", function(event) {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.id;

    // Edit
    if (event.target.matches(".edit")) {
        editTask(taskId);

    }


    // Delete
    if (event.target.matches(".delete")) {
        deleteTask(taskId);

    }

});

// CHECKBOX EVENTS
taskList.addEventListener("change", function(event) {
    if (!event.target.matches(".task-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".task-item");
    if (!taskItem) {
        return;
    }


    const taskId = taskItem.dataset.id;
    toggleTask(taskId);

});


// FILTER EVENTS
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        // Update current filter
        currentFilter = button.dataset.filter;


        // Update button states
        filterButtons.forEach(function(filterButton) {
            filterButton.classList.remove("active");
            filterButton.setAttribute(
                "aria-pressed",
                "false"
            );

        });


        // Activate selected filter
        button.classList.add("active");
        button.setAttribute(
            "aria-pressed",
            "true"
        );


        // Re-render tasks
        renderTasks();

    });

});

// INITIALIZE APPLICATION

// Hide error state initially
errorState.hidden = true;

// Load tasks when page starts
loadTasks();