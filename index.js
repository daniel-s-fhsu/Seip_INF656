const fs = require('fs').promises;

const getAllTasks = async function () {
    const data = await fs.readFile('tasks.json', 'utf-8');
    return JSON.parse(data).tasks;
};

const listAllTasks = function() {
    getAllTasks()
        .then(tasks => {
            let index = 1;
            for(let task of tasks) {
                console.log("Task #" + index);
                console.log("Title:\t\t" + task.title);
                console.log("Description:\t" + task.description);
                console.log("Status:\t\t" + task.status);
                console.log("\n");
                index++;
            }
    });
}

const printMenu = function() {
    console.log("Enter the number of the action to take")
    console.log("(1) List all tasks");
    console.log("(2) Add new task");
}


listAllTasks();