const fs = require('fs').promises;
const readline = require('readline').promises;

const getAllTasks = async function () {
    try {
        const data = await fs.readFile('tasks.json', 'utf-8');
        return JSON.parse(data).tasks;
    } catch (err) {
        console.error("No tasks found");
        return [];
    }
};

const listAllTasks = async function() {
    const taskList = await getAllTasks();

    let index = 1;
    for(let task of taskList) {
        console.log("Task #" + index);
        console.log("Title:\t\t" + task.title);
        console.log("Description:\t" + task.description);
        console.log("Status:\t\t" + task.status);
        console.log("\n");
        index++;
    }

}

const prompt = async (message) => {
    // Helper function to get input
    // Takes a message string as a parameter to display as prompt to user
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const result = await rl.question(message);
    rl.close();
    return result;
}

const addTask = async function() {
    const title = await prompt("Enter a title: ");
    const description = await prompt("Enter a description: ");

    const existingTasks = await getAllTasks();
    const newTask = {
        title: title,
        description: description,
        status: 'Incomplete'
    };

    const updatedTasks = [...existingTasks, newTask];

    try {
        await fs.writeFile('tasks.json', JSON.stringify({tasks: updatedTasks}, null, 2));
    } catch (err) {
        console.error("Error updating task list");
    }
}

const completeTask = async function(taskTitle) {
    const existingTasks = await getAllTasks();
    let updated = false;
    const newTasks = existingTasks.map((task) => { 
        if (task.title === taskTitle) {
            updated = true;
            return ({title: task.title, description: task.description, status: 'Complete'})
        } else {
            return task;
        }
    });

    if (updated) {
        console.log("Task found and updated");
    } else {
        console.error("Task not found");
    }

    try {
        await fs.writeFile('tasks.json', JSON.stringify({tasks: newTasks}, null, 2));
    } catch (err) {
        console.error("Error updating task list");
    }
}

const pickTask = async function() {
    await listAllTasks();
    const taskList = await getAllTasks()
    const choice = await prompt("Enter the task number: ");
    if (isNaN(choice)) {
        console.error("That is not a number");
    } else if (choice <=0 || choice > taskList.length) {
        console.error("Choice not in task list");
    } else {
        await completeTask(taskList[choice-1].title);
    }
}

const printMenu = function() {
    console.log("Enter the number of the action to take")
    console.log("(1) List all tasks");
    console.log("(2) Add new task");
    console.log("(3) Mark task complete")
    console.log("(4) Exit");
}


// main loop
const main = async () => {
    while (true) {
        printMenu();
        const userInput = await prompt(':')
        const choice = parseInt(userInput, 10);
        if (isNaN(choice)) {
            console.log("Enter a number");
        } else {
            switch (choice) {
                case 1:
                    await listAllTasks();
                    break;
                case 2:
                    await addTask();
                    break;
                case 3:
                    await pickTask();
                    break;
                case 4:
                    return;
                default:
                    console.log("Not a valid choice");
                    break;
            }
        }
    }
}

main();