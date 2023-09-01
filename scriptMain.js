class Task {
    constructor(title, checked, date=null,category = "none") {
        this.title = title;
        this.checked = checked;
        this.date = date;
        this.category = category;
    }
}

//validation
function validateInput(userInput, arrTopics) {
    const input = userInput.trim();
    if (input.length === 0) {
        return false;
    } else {
        const found = arrTopics.some(topicObj => topicObj.title.toLowerCase().includes(input));
        return !found;
    }
}

//display tasks
function displayTasks(taskArray) {
    const mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";

    taskArray.forEach((obj, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.id = index;
        let string ="";
        string += `<input type="checkbox" ${obj.checked === 1 ? "checked" : ''}>
                <span class="to-do" title="Click to edit task"
                style="text-decoration-line:${obj.checked === 1 ? 'line-through' : 'none'}">${obj.title}</span>`
                
        
        if(obj.category != "none"){
            string += `<span class='span-category' title="Click to edit task">${obj.category} </span>`
        }
        
        if(obj.date != ""){
            string += `<span class="span-date" title="Click to edit task">${obj.date}</span>`
        }
       
        string += `<i class="bi bi-trash-fill" title="Click to delete task"></i>`;

        taskElement.innerHTML = string;
        mainContainer.appendChild(taskElement);
    });

    if(taskArray.length == 0){
        document.querySelector(".bi-three-dots-vertical").style["display"] = "none";
    }
    else{
        document.querySelector(".bi-three-dots-vertical").style["display"] = "block";
    }
}

// add task
function addTask() {
    const input = document.querySelector('.main-header-input');
    const date = document.querySelector('.main-header-date');
    const category = document.querySelector('#main-header-dropdown');
    let taskArray = JSON.parse(localStorage.getItem("taskArray")) || [];
    
    if(validateInput(input.value,taskArray)){
        taskArray.unshift(new Task(input.value, 0,date.value,category.value));
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
        displayTasks(taskArray);
    }
    input.value = "";
    category.value = "none";
    date.value = "";
}

// handle adding a task
document.querySelector("#add-button").addEventListener("click", function(event) {
    addTask();
    event.target.disabled = true;
});

//disable add button when input is empty
const inputElement = document.querySelector(".main-header-input");
const addButton = document.querySelector("#add-button");


addButton.disabled = inputElement.value.trim().length === 0;

inputElement.addEventListener("input", function(event) {
    // Enable the button if the input is not empty
    addButton.disabled = event.target.value.trim().length === 0;
    if (addButton.disabled == false) {
        addButton.removeAttribute("title");
    } else {
        addButton.setAttribute("title", "Click to add");
    }
});

inputElement.addEventListener("change", function(event) {
    // Enable the button if the input is not empty
    addButton.disabled = event.target.value.trim().length === 0;
    if (addButton.disabled == false) {
        addButton.removeAttribute("title");
    } else {
        addButton.setAttribute("title", "Click to add");
    }
});



// display dates onwards today
document.addEventListener("DOMContentLoaded", function() {
    const dateInput = document.querySelector(".main-header-date");
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    dateInput.min = formattedDate;
  });
  
//check task
function checkTask(clickedElement){
    const parentElement = clickedElement.parentNode;
    let id= Number(parentElement.id);

    const taskArray = JSON.parse(localStorage.getItem("taskArray"));
    
    //update data
    taskArray[id].checked == 0 ? taskArray[id].checked = 1 : taskArray[id].checked = 0;
    
    //update local storage taskArray and display
    const newarr = taskArray.sort((a,b)=> a.checked - b.checked);
    localStorage.setItem("taskArray", JSON.stringify(newarr));
    displayTasks(newarr);
}

// handle checkbox clicks
document.querySelector(".main-container").addEventListener("change", function(event) {
    if (event.target.matches("input[type='checkbox']")) {
        checkTask(event.target);
    }
});

// delete task
function deleteTask(clickedElement){
    const parentElement = clickedElement.parentNode;
    let id= Number(parentElement.id);

    const taskArray = JSON.parse(localStorage.getItem("taskArray"));
    taskArray.splice(id,1);

    localStorage.setItem("taskArray", JSON.stringify(taskArray));
    displayTasks(taskArray);
}

// handle task deletion
document.querySelector(".main-container").addEventListener("click", function(event) {
    if (event.target.matches(".bi-trash-fill")) {
        //const parentElement = event.target.parentNode;
        deleteTask(event.target);
    }
});

document.querySelector(".bi-three-dots-vertical").addEventListener("click",function(){
    document.querySelector("#three-dots-dropdown").style["display"] = "block";
});

document.querySelector(".three-dots-dropdown-content a").addEventListener("click",function(event){
    clearAllTasks();
    
});


function clearAllTasks(){
     if (confirm("Do you want to delete all tasks?") == true) {
         localStorage.removeItem("taskArray");
         document.querySelector(".main-container").innerHTML = "";
        document.querySelector(".bi-three-dots-vertical").style["display"] = "none";
    } 
    document.querySelector("#three-dots-dropdown").style["display"] = "none";
}


// open edit box to edit task
function openEditBox(clickedElement,taskArray) {
    const parentElement = clickedElement.parentNode;
    let index= Number(parentElement.id);
   
    const editBox = document.createElement("div");
    editBox.className = "edit-box";

    editBox.innerHTML = `
                        <h4>Edit the Task</h4>
                        <div class="edit-box-main-container">
                             <input type="text" class="edit-title" value="${taskArray[index].title}">
                            <input class="edit-date" type="date" value="${taskArray[index].date}">
                            <select class="edit-label">
                                <option value="none">Category</option>
                                <option value="Personal" ${taskArray[index].category == "Personal" ? "selected" : ""}>Personal</option>
                                <option value="Work" ${taskArray[index].category == "Work" ? "selected" : ""}>Work</option>
                                <option value="Education" ${taskArray[index].category == "Education" ? "selected" : ""}>Education</option>  
                            </select>
                        </div>
                        <div class="edit-box-btn-container">
                            <button class="save-button">Save</button>
                            <button class="cancel-button">Cancel</button>
                        </div>
                        `;

    const mainContainer = document.querySelector(".main-container");
    mainContainer.appendChild(editBox);

    
    // display dates onwards today
    const dateInput = document.querySelector(".edit-date");
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    dateInput.min = formattedDate;


    const saveButton = editBox.querySelector(".save-button");
    saveButton.addEventListener("click", () => saveEditedTask(index,taskArray));

    const cancelButton = editBox.querySelector(".cancel-button");
    cancelButton.addEventListener("click",() => {
        const editBox = document.querySelector(".edit-box");
        editBox.remove();
    });
}

// Save the edited task 
function saveEditedTask(index,taskArray) {
    
    const editBox = document.querySelector(".edit-box");
    const editedTitle = editBox.querySelector(".edit-title").value;
    const editedDate = editBox.querySelector(".edit-date").value;
    const editedCategory = editBox.querySelector(".edit-label").value;

    //const taskArray = JSON.parse(localStorage.getItem("taskArray"));

    if(editedTitle.length != 0){
        taskArray[index].title = editedTitle
        taskArray[index].date = editedDate;
        taskArray[index].category = editedCategory;
    }
    
    
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
    editBox.remove(); // Remove the edit box
    // Update the displayed tasks
    displayTasks(taskArray);
}

//handle editing of task
document.querySelector(".main-container").addEventListener("click", function(event) {
    if (event.target.matches("span")) {
        event.target.parentElement.style["background-color"] = "#dbaaf6";
        const taskArray = JSON.parse(localStorage.getItem("taskArray"));
        openEditBox(event.target,taskArray);   
    }
});

//Close the dropdown if the user clicks outside of it
document.addEventListener("click",function(event) {
    if (!event.target.matches('.bi-three-dots-vertical')) {
      let dropdown = document.querySelector(".three-dots-dropdown-content");
        if (dropdown.style["display"] != "none") {
            dropdown.style["display"] = "none";
        }
      }
    }
  )

//driver function
let taskarr = JSON.parse(localStorage.getItem("taskArray")) || [];
displayTasks(taskarr);

