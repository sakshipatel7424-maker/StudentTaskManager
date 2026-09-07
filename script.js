// ==========================================
// STUDENT TASK MANAGER
// ==========================================


// ==========================================
// LOAD TASKS FROM LOCAL STORAGE
// ==========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const taskInput = document.getElementById("taskInput");

const deadlineInput = document.getElementById("deadlineInput");

const priorityInput = document.getElementById("priorityInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// Current filter
let currentFilter = "all";


// ==========================================
// ADD TASK
// ==========================================

addTaskBtn.addEventListener("click", addTask);


function addTask() {

    const title = taskInput.value.trim();

    const deadline = deadlineInput.value;

    const priority = priorityInput.value;


    // Check if task name is empty

    if (title === "") {

        alert("Please enter a task!");

        return;
    }


    // Create new task object

    const task = {

        id: Date.now(),

        title: title,

        deadline: deadline,

        priority: priority,

        completed: false

    };


    // Add task to array

    tasks.push(task);


    // Save task

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    deadlineInput.value = "";

    priorityInput.value = "High";


    // Display tasks

    displayTasks();
}



// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    // Clear old task cards

    taskList.innerHTML = "";


    // Start with all tasks

    let filteredTasks = tasks;


    // Show pending tasks

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    // Show completed tasks

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // Create card for every task

    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");


        taskCard.className = "task-card";


        // Add completed class

        if (task.completed) {

            taskCard.classList.add("completed");

        }


        // Task card HTML

        taskCard.innerHTML = `

            <div class="task-info">

                <h3>${task.title}</h3>


                <p>

                    📅 Deadline:

                    ${task.deadline || "No deadline"}

                </p>


                <p>

                    Priority:

                    ${getPriorityEmoji(task.priority)}

                    ${task.priority}

                </p>

            </div>


            <div class="task-actions">


                <button

                    class="complete-btn"

                    onclick="toggleTask(${task.id})">

                    ${task.completed
                        ? "↩️ Undo"
                        : "✅ Complete"}

                </button>


                <button

                    class="delete-btn"

                    onclick="deleteTask(${task.id})">

                    🗑️ Delete

                </button>


            </div>

        `;


        // Add card to page

        taskList.appendChild(taskCard);

    });


    // Update dashboard

    updateDashboard();

}



// ==========================================
// PRIORITY EMOJI
// ==========================================

function getPriorityEmoji(priority) {


    if (priority === "High") {

        return "🔴";

    }


    if (priority === "Medium") {

        return "🟡";

    }


    return "🟢";

}



// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

function toggleTask(id) {


    tasks = tasks.map(task => {


        if (task.id === id) {

            task.completed = !task.completed;

        }


        return task;

    });


    // Save changes

    saveTasks();


    // Refresh tasks

    displayTasks();

}



// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {


    tasks = tasks.filter(
        task => task.id !== id
    );


    // Save changes

    saveTasks();


    // Refresh tasks

    displayTasks();

}



// ==========================================
// FILTER TASKS
// ==========================================

filterButtons.forEach(button => {


    button.addEventListener("click", () => {


        // Remove active from all buttons

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        // Make clicked button active

        button.classList.add("active");


        // Get selected filter

        currentFilter = button.dataset.filter;


        // Display filtered tasks

        displayTasks();

    });

});



// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {


    // Total tasks

    const total = tasks.length;


    // Completed tasks

    const completed = tasks.filter(
        task => task.completed
    ).length;


    // Pending tasks

    const pending = total - completed;


    // Display numbers

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}



// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {


    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}



// ==========================================
// LOAD TASKS WHEN PAGE OPENS
// ==========================================

displayTasks();



// ==========================================
// 🤖 AI STUDY PLANNER
// ==========================================

const aiPlanBtn = document.getElementById("aiPlanBtn");

const aiResult = document.getElementById("aiResult");



// ==========================================
// AI BUTTON CLICK
// ==========================================

aiPlanBtn.addEventListener("click", async () => {


    // Check if there are tasks

    if (tasks.length === 0) {


        aiResult.innerHTML = `

            <p>

                Please add some tasks first! 📚

            </p>

        `;


        return;

    }


    // Show loading message

    aiResult.innerHTML = `

        <p>

            🤖 AI is analyzing your tasks...

        </p>

    `;


    try {


        // Send tasks to Flask backend

        const response = await fetch(

            "https://studenttaskmanager-2gz1.onrender.com/plan",

            {

                method: "POST",


                headers: {

                    "Content-Type": "application/json"

                },


                body: JSON.stringify({

                    tasks: tasks

                })

            }

        );


        // Convert response to JSON

        const data = await response.json();


        // Check for backend error

        if (data.error) {


            aiResult.innerHTML = `

                <p>

                    ❌ ${data.error}

                </p>

            `;


            return;

        }


        // Display AI study plan

        aiResult.innerHTML = `

            <h3>

                🤖 Your AI Study Plan

            </h3>


            <p>

                ${data.plan.replace(/\n/g, "<br>")}

            </p>

        `;


    } catch (error) {


        // Show connection error

        aiResult.innerHTML = `

            <p>

                ❌ Could not connect to the AI server.

                Please try again.

            </p>

        `;


        console.error(error);

    }

});