const addBtn = document.getElementById('add-task-btn');
const input = document.getElementById('new-task');
const taskList = document.getElementById("task-list");
const counter=document.getElementById("counter");
const clear=document.getElementById("clear");
let tasks = [];
const buttons = document.querySelectorAll('.filter-btn');
console.log(buttons); 
let currentFilter = 'all';
let filterArr = [];

addBtn.addEventListener("click",() => {
     let taskText = input.value;
    console.log(taskText);//it prints what we wrote
    addTask(taskText);
    //tasks.push(taskText);
     console.log(tasks);//prints in array[] 1time,next 2times
     applyFilter()
     input.value = '';
 })


 input.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
     let taskText = input.value;
     if (taskText !== '') {
       addTask(taskText);  // ✅ Correct way
       applyFilter();
       input.value = '';
     }
   }
 });


 buttons.forEach((btn) => {
   btn.addEventListener("click", () => {
     buttons.forEach((b) => {
  b.classList.remove('active')
        })
     btn.classList.add('active');
   currentFilter = btn.getAttribute("data-filter");
    console.log(currentFilter);
       applyFilter()
    })
 })

 //if we click on the button, applyfilter will check the value of current filtr and update the filterArr
 function applyFilter() {
     if(currentFilter === 'all') {
         filterArr = tasks
  } else if (currentFilter === 'active') {
        filterArr = tasks.filter(task => task.completed === false);
  } else {
       filterArr = tasks.filter(task => task.completed === true);
    }
     showTasks()
    UpdateCounter()
 }

 function addTask(userInput) {
     const newTask = {
      id : generateTaskId(),
         text:userInput,
        completed:false
    }
   console.log('the new task is',newTask)
   tasks.push(newTask)
 }
 
 function showTasks() {
     taskList.innerHTML = "";
     if(tasks.length === 0) {
    taskList.innerHTML = '<li class="empty-message">Your to-do list is empty</li>'
    }
     filterArr.forEach((task) => {
      
    let li=document.createElement("li");
     li.setAttribute("data-id",task.id);
  //create elements inside li
 const checkbox = document.createElement('input');
 const span = document.createElement('span');
 const deleteBtn = document.createElement('button');

  //adding attributes and values
 checkbox.type = 'checkbox';
    checkbox.checked = task.completed; //false

    checkbox.addEventListener("change", () => {
        handleToggle(task.id);
    })

    span.innerText = task.text;
    if(checkbox.checked === true) {
        span.classList.add('completed')
    }
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
deleteBtn.addEventListener('click',()=>{
    tasks=tasks.filter(t=>t.id!==task.id);
    applyFilter();
})
    //append inside li
    li.append(checkbox);
    li.append(span);
    li.append(deleteBtn);

    console.log(li)
    taskList.append(li);
    })
}

function handleToggle(id) {
    //grab the array of objects
    //rght now each object has completed status false
    //don't change completed status in any of those objects
    //except the one on which user clicked
    tasks = tasks.map((task) => {
        if(task.id === id) {
            return {...task,completed:!task.completed}
        } else {
            return task
        }
    })
  
    applyFilter();

}


 function generateTaskId() {
  return Math.floor(1000 + Math.random() * 9000);
}

document.addEventListener("DOMContentLoaded", () => {
    applyFilter();

 })
function UpdateCounter() {
  let activeCount = tasks.filter(task => !task.completed).length;
counter.innerText = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
 }
 clear.addEventListener('click', () => {
   tasks = tasks.filter(task => !task.completed); // Removes completed tasks
   applyFilter(); // Updates the UI
 });
