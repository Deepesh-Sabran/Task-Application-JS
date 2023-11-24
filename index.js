//backup data
const state = {
    taskList: []
};

//DOM operation
const taskContent = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task__modal_body");

//Templet for card on the screen
const htmlTaskContent = ({id, url, title, type, description}) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
        <div class="card shadow-sm task__card">

            <div class="card-header d-flex justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="editTask.apply(this, arguments)">
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask.apply(this, arguments)">
                    <i class="fas fa-trash-can" name=${id}></i>
                </button>
            </div>

            <div class="card-body">
                ${
                    url ?
                    `<img width="100%" src=${url} alt="Card Image" class="card-img-top md-3 rounded-lg" />`
                    : `<img width="100%" src="https://th.bing.com/th/id/OIP.F00dCf4bXxX0J-qEEf4qIQHaD6?w=326&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
                }
                <h5 class="card-title task__card__title">${title}</h5>
                <div class="tags text-white d-flex flex-wrap">
                    <span class="badge bg-primary my-1">${type}</span>
                </div>
                <p class="description trim-3-lines text-muted">${description}</p>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#addNewModal" onclick="openTask.apply(this, arguments)" id=${id}>Open Task</button>
            </div>
        </div>
    </div>
`;

//Modal body on >> click of open task
const htmlModalContent = ({id, url, title, description}) => {
    const date = new Date(parseInt(id));
    return `
        <div id=${id}>
            ${
                url ?
                `<img width="100%" src=${url} alt="Card Image" class="card-img-top md-3 rounded-lg" />`
                : `<img width="100%" src="https://th.bing.com/th/id/OIP.F00dCf4bXxX0J-qEEf4qIQHaD6?w=326&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
            }
            <strong class="text-muted text-sm">Created on : ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
            <p class="text-muted">${description}</p>
        </div>
    `;
};

//convert JSON > STRING for localStorage/Browser Storage
const updateLocalStorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({    //method to convert JSON > STRING
            tasks: state.taskList,
        })
    );
};

//convert STRING > JSON for rendering the cards on the screen
const loadInitialData = () => {
    // if(localStorage.task === undefined) {return JSON.stringify({tasks: state.taskList})}
    const localStorageCopy = JSON.parse(localStorage.task); //method to convert STRING > JSON

    // check if localStorageCopy have some value
    if(localStorageCopy) state.taskList = localStorageCopy.tasks;

    // now MAP the taskList[] accordingly
    state.taskList.map((cardDate) => {
        // if (taskContent) { // Check if taskContent is not null
        // }
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
};

// After filling the blanks we need to save
const handleSubmit = (event) => {
    console.log("Event triggered !!")
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imgURL").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("tags").value,
        description: document.getElementById("taskDescription").value,
    };

    if(input.title==="" || input.type==="" || input.description==="") {
        alert("Please fill the Necessary fields !!");
    }

    // if(taskContent){
    // }
    taskContent.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({...input, id})
    );
    
    state.taskList.push({...input, id});
    updateLocalStorage();
};

// open task button functionality
const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
    // console.log(getTask);
};

// To delete the task
const deleteTask = (e) => {
    if (!e) e = window.event;
  
    const targetId = e.target.getAttribute("name");
    // console.log(targetId);
    const type = e.target.tagName;
    // console.log(type);
    const removeTask = state.taskList.filter(({ id }) => id !== targetId);
    // console.log(removeTask);
    updateLocalStorage();

    if (type === "BUTTON") {
      // console.log(e.target.parentNode.parentNode.parentNode.parentNode);
      return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
      );
    } else if (type === "I") {
      return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
      );
    }
};

// to edit the content
const editTask = (e) => {
    if(!e) e = window.event;
    const targetId = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskType;
    let taskDescription;
    let submitBtn;

    if(type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    // for accesing each element we read each node..
    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskType = parentNode.childNodes[3].childNodes[5].childNodes[1];
    taskDescription = parentNode.childNodes[3].childNodes[7];
    submitBtn = parentNode.childNodes[5].childNodes[1];
    // console.log(taskTitle);
    // console.log(taskTitle, taskDescription, taskType, submitBtn);

    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");

    submitBtn.setAttribute("onclick", "saveEdit.apply(this, arguments)");

    submitBtn.removeAttribute("data-bs-toggle");
    submitBtn.removeAttribute("data-bs-target");
    submitBtn.textContent = "Save Changes";
};


// After editinng save the content
const saveEdit = (e) => {
    if(!e) e = window.event;
    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes);

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskType = parentNode.childNodes[3].childNodes[5].childNodes[1];
    const taskDescription = parentNode.childNodes[3].childNodes[7];
    const submitBtn = parentNode.childNodes[5].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.textContent,
        taskDescription: taskDescription.textContent,
        taskType: taskType.textContent,
    };

    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) => task.id === targetId ? {
        id: task.id,
        title: updatedData.taskTitle,
        description: updatedData.taskDescription,
        type: updatedData.taskType,
        url: task.url,
    } : task);
    state.taskList = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");

    submitBtn.setAttribute("onclick", "openTask.apply(this, arguments)");

    submitBtn.setAttribute("data-bs-toggle", "modal");
    submitBtn.setAttribute("data-bs-target", "#showTask");
    submitBtn.innerHTML = "Open Task";
};


// For the search bar
const searchTask = (e) => {
    if(!e) e = window.event;
    while(taskContent.firstChild) {
        taskContent.removeChild(taskContent.firstChild);
    }

    const resultData = state.taskList.filter(({title}) => 
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // console.log(resultData);

    resultData.map((cardData) => {
        taskContent.insertAdjacentHTML("beforeend", htmlModalContent(cardData));
    });
};