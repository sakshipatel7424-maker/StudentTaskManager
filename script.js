let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";


// ADD TASK
addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const title = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "High";

    displayTasks();
}


// DISPLAY TASKS
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";

        if (task.completed) {
            taskCard.classList.add("completed");
        }

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
                    ${task.completed ? "↩️ Undo" : "✅ Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑️ Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskCard);
    });

    updateDashboard();
}


// PRIORITY EMOJI
function getPriorityEmoji(priority) {

    if (priority === "High") {
        return "🔴";
    }

    if (priority === "Medium") {
        return "🟡";
    }

    return "🟢";
}


// COMPLETE / UNCOMPLETE TASK
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}


// DELETE TASK
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}


// FILTER TASKS
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});


// DASHBOARD
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// SAVE TASKS
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// LOAD TASKS WHEN PAGE OPENS
displayTasks();


// AI STUDY PLANNER

const aiPlanBtn = document.getElementById("aiPlanBtn");
const aiResult = document.getElementById("aiResult");

aiPlanBtn.addEventListener("click", async () => {

    if (tasks.length === 0) {
        aiResult.innerHTML = "<p>Please add some tasks first! 📚</p>";
        return;
    }

    aiResult.innerHTML = "<p>🤖 AI is analyzing your tasks...</p>";

    try {

        const response = await fetch("hcomttps://studenttaskmanager-2gz1.onrender.com", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                tasks: tasks
            })

        });

        const data = await response.json();

        if (data.error) {
            aiResult.innerHTML = `
                <p>❌ ${data.error}</p>
            `;
            return;
        }

        aiResult.innerHTML = `
            <h3>🤖 Your AI Study Plan</h3>
            <p>${data.plan.replace(/\n/g, "<br>")}</p>
        `;

    } catch (error) {

        aiResult.innerHTML = `
            <p>
                ❌ Could not connect to the AI server.
                Make sure Flask is running.
            </p>
        `;

        console.error(error);
    }

});