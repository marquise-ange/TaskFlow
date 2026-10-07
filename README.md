# TaskFlow

TaskFlow is a simple and responsive task management application that helps users create, organize, complete, edit, and delete daily tasks.

##  Live Demo

[TaskFlow Live Demo](https://taskflow-iyzx.onrender.com/)

##  GitHub Repository

[TaskFlow on GitHub](https://github.com/marquise-ange/TaskFlow)

##  Features

- Add new tasks
- Display saved tasks
- Mark tasks as completed
- Edit existing tasks
- Delete tasks
- Filter tasks by:
  - All
  - Active
  - Completed
- Display the number of remaining tasks
- Tasks are sorted with the newest tasks first
- Tasks remain saved after refreshing the page
- Form validation for empty and invalid task titles
- Responsive design for mobile and desktop screens
- Error handling when Firebase operations fail
- Accessible form labels, buttons, and task controls

##  Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Firebase
- Cloud Firestore
- Git & GitHub
- Render

## Firebase & Firestore

TaskFlow uses **Cloud Firestore** to store tasks.

Each task contains:


title       → string
completed   → boolean
createdAt   → server timestamp


The Firestore `tasks` collection is used to store and manage all task data.

Firebase Security Rules are used to validate the structure and type of task data before it is stored.

##  Project Structure


TaskFlow->CSS/index.css
        ->JS/app.js
        ->index.html
        ->firebase.js
        ->README.md


##  How to Run Locally

1. Clone the repository:


git clone https://github.com/marquise-ange/TaskFlow.git

2. Open the project folder:

cd TaskFlow

3. Open `index.html` using a local development server such as **VS Code Live Server**.

4. The application will connect to Firebase Firestore and allow you to manage tasks.

##  Data Validation

TaskFlow validates task data before it is written to Firestore.

Task titles must:

- Be text
- Contain at least 1 character
- Contain no more than 100 characters
- Include a boolean `completed` value
- Include a `createdAt` timestamp when created

##  Responsive Design

The interface is designed to work on:

- Mobile devices
- Tablets
- Desktop screens

The layout is optimized for small screens, including approximately **360px wide** devices.

##  Project Purpose

This project was developed as part of a technical assessment to demonstrate practical skills in:

- Frontend web development
- JavaScript
- Firebase integration
- Cloud Firestore CRUD operations
- Responsive web design
- Accessibility
- Git and GitHub workflow.