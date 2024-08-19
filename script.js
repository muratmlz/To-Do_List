// Επιλογή στοιχείων από το DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const filterAll = document.getElementById('all-btn');
const filterCompleted = document.getElementById('completed-btn');
const filterPending = document.getElementById('pending-btn');

// Φόρτωση αποθηκευμένων εργασιών από το Local Storage
document.addEventListener('DOMContentLoaded', loadTasks);

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Λήψη της τιμής από το input
    const taskText = taskInput.value;

    // Δημιουργία νέας εργασίας στη λίστα
    addTask(taskText);

    // Αποθήκευση της εργασίας στο Local Storage
    saveTask(taskText);

    // Καθαρισμός του input
    taskInput.value = '';
});

// Προσθήκη νέας εργασίας στη λίστα
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (completed) li.classList.add('completed');

    // Δημιουργία checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
        toggleTaskCompletion(li, checkbox.checked);
    });
    li.prepend(checkbox);

    // Δημιουργία κουμπιού διαγραφής
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Διαγραφή';
    deleteBtn.addEventListener('click', function() {
        removeTask(li);
    });
    li.appendChild(deleteBtn);

    // Προσθήκη στη λίστα
    taskList.appendChild(li);
}

// Αποθήκευση εργασίας στο Local Storage
function saveTask(taskText, completed = false) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push({ text: taskText, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Φόρτωση εργασιών από το Local Storage
function loadTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(function(task) {
        addTask(task.text, task.completed);
    });
}

// Διαγραφή εργασίας
function removeTask(taskItem) {
    // Διαγραφή από το DOM
    taskItem.remove();

    // Διαγραφή από το Local Storage
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.text !== taskItem.textContent.replace('Διαγραφή', '').trim());
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Εναλλαγή κατάστασης ολοκλήρωσης
function toggleTaskCompletion(taskItem, completed) {
    if (completed) {
        taskItem.classList.add('completed');
    } else {
        taskItem.classList.remove('completed');
    }

    // Ενημέρωση Local Storage
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => task.text === taskItem.textContent.replace('Διαγραφή', '').trim()
        ? { ...task, completed }
        : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Φιλτράρισμα εργασιών
filterAll.addEventListener('click', () => {
    filterTasks('all');
});
filterCompleted.addEventListener('click', () => {
    filterTasks('completed');
});
filterPending.addEventListener('click', () => {
    filterTasks('pending');
});

function filterTasks(filter) {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        if (filter === 'all') {
            task.style.display = '';
        } else if (filter === 'completed' && task.classList.contains('completed')) {
            task.style.display = '';
        } else if (filter === 'pending' && !task.classList.contains('completed')) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

// Εναλλαγή θεμάτων
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.classList.toggle('dark-mode'));
});