#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TASKS_FILE = path.join(__dirname, '..', 'tasks', 'tasks.json');

// Create interface for command line input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load tasks from file
function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tasks:', error.message);
    return { tasks: [] };
  }
}

// Save tasks to file
function saveTasks(tasksData) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2), 'utf8');
    console.log('Tasks saved successfully.');
  } catch (error) {
    console.error('Error saving tasks:', error.message);
  }
}

// List all tasks
function listTasks() {
  const tasksData = loadTasks();
  
  console.log('\n=== TASKS ===\n');
  
  tasksData.tasks.forEach(task => {
    const statusEmoji = getStatusEmoji(task.status);
    console.log(`${statusEmoji} [${task.id}] ${task.title} - ${task.status}`);
    
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach(subtask => {
        const subtaskStatusEmoji = getStatusEmoji(subtask.status);
        console.log(`  ${subtaskStatusEmoji} [${subtask.id}] ${subtask.title} - ${subtask.status}`);
      });
    }
    console.log('');
  });
}

// Get emoji for status
function getStatusEmoji(status) {
  switch (status) {
    case 'done':
      return '✅';
    case 'in-progress':
      return '🔄';
    case 'pending':
      return '⏳';
    case 'cancelled':
      return '❌';
    default:
      return '❓';
  }
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
  const tasksData = loadTasks();
  let updated = false;
  
  // Check if it's a subtask (contains a dot)
  if (taskId.includes('.')) {
    const [parentId, subtaskId] = taskId.split('.');
    
    const parentTask = tasksData.tasks.find(task => task.id === parentId);
    if (parentTask && parentTask.subtasks) {
      const subtask = parentTask.subtasks.find(st => st.id === taskId);
      if (subtask) {
        subtask.status = newStatus;
        updated = true;
      }
    }
  } else {
    // It's a main task
    const task = tasksData.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      updated = true;
    }
  }
  
  if (updated) {
    saveTasks(tasksData);
    console.log(`Task ${taskId} status updated to ${newStatus}`);
  } else {
    console.log(`Task ${taskId} not found`);
  }
}

// Add a new task
function addTask(title, description) {
  const tasksData = loadTasks();
  
  // Generate new ID (max ID + 1)
  const maxId = Math.max(0, ...tasksData.tasks.map(t => parseInt(t.id)));
  const newId = (maxId + 1).toString();
  
  const newTask = {
    id: newId,
    title,
    description,
    status: 'pending',
    subtasks: []
  };
  
  tasksData.tasks.push(newTask);
  saveTasks(tasksData);
  console.log(`New task added with ID: ${newId}`);
}

// Add a subtask
function addSubtask(parentId, title, description) {
  const tasksData = loadTasks();
  
  const parentTask = tasksData.tasks.find(t => t.id === parentId);
  if (!parentTask) {
    console.log(`Parent task ${parentId} not found`);
    return;
  }
  
  if (!parentTask.subtasks) {
    parentTask.subtasks = [];
  }
  
  // Generate new subtask ID
  const maxSubId = parentTask.subtasks.length > 0 
    ? Math.max(...parentTask.subtasks.map(st => parseInt(st.id.split('.')[1])))
    : 0;
  const newSubId = `${parentId}.${maxSubId + 1}`;
  
  const newSubtask = {
    id: newSubId,
    title,
    description,
    status: 'pending',
    details: ''
  };
  
  parentTask.subtasks.push(newSubtask);
  saveTasks(tasksData);
  console.log(`New subtask added with ID: ${newSubId}`);
}

// Show task details
function showTaskDetails(taskId) {
  const tasksData = loadTasks();
  
  // Check if it's a subtask
  if (taskId.includes('.')) {
    const [parentId, subtaskId] = taskId.split('.');
    
    const parentTask = tasksData.tasks.find(task => task.id === parentId);
    if (parentTask && parentTask.subtasks) {
      const subtask = parentTask.subtasks.find(st => st.id === taskId);
      if (subtask) {
        console.log('\n=== SUBTASK DETAILS ===\n');
        console.log(`ID: ${subtask.id}`);
        console.log(`Title: ${subtask.title}`);
        console.log(`Description: ${subtask.description}`);
        console.log(`Status: ${subtask.status}`);
        console.log(`Details: ${subtask.details || 'No details provided'}`);
        return;
      }
    }
  } else {
    // It's a main task
    const task = tasksData.tasks.find(t => t.id === taskId);
    if (task) {
      console.log('\n=== TASK DETAILS ===\n');
      console.log(`ID: ${task.id}`);
      console.log(`Title: ${task.title}`);
      console.log(`Description: ${task.description}`);
      console.log(`Status: ${task.status}`);
      console.log(`Subtasks: ${task.subtasks ? task.subtasks.length : 0}`);
      return;
    }
  }
  
  console.log(`Task ${taskId} not found`);
}

// Main menu
function showMenu() {
  console.log('\n=== TASK MANAGER ===\n');
  console.log('1. List all tasks');
  console.log('2. Show task details');
  console.log('3. Update task status');
  console.log('4. Add new task');
  console.log('5. Add subtask');
  console.log('0. Exit');
  
  rl.question('\nEnter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        listTasks();
        setTimeout(showMenu, 500);
        break;
      case '2':
        rl.question('Enter task ID: ', (taskId) => {
          showTaskDetails(taskId);
          setTimeout(showMenu, 500);
        });
        break;
      case '3':
        rl.question('Enter task ID: ', (taskId) => {
          rl.question('Enter new status (pending/in-progress/done/cancelled): ', (status) => {
            updateTaskStatus(taskId, status);
            setTimeout(showMenu, 500);
          });
        });
        break;
      case '4':
        rl.question('Enter task title: ', (title) => {
          rl.question('Enter task description: ', (description) => {
            addTask(title, description);
            setTimeout(showMenu, 500);
          });
        });
        break;
      case '5':
        rl.question('Enter parent task ID: ', (parentId) => {
          rl.question('Enter subtask title: ', (title) => {
            rl.question('Enter subtask description: ', (description) => {
              addSubtask(parentId, title, description);
              setTimeout(showMenu, 500);
            });
          });
        });
        break;
      case '0':
        console.log('Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        setTimeout(showMenu, 500);
    }
  });
}

// Start the application
console.log('Task Manager - Simple CLI for managing tasks');
showMenu();
