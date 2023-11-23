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
                <button type="button" class="btn btn-outline-info mr-2" name=${id}>
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id}>
                    <i class="fas fa-trash-can" name=${id}></i>
                </button>
            </div>

            <div class="card-body">
                ${
                    url ?
                    `<img width="100%" src=${url} alt="card img" class="card-img-top md-3 rounded-lg" />`
                    : `<img width="100%" src="https://th.bing.com/th/id/OIP.F00dCf4bXxX0J-qEEf4qIQHaD6?w=326&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="card img" class="img-fluid place__holder__image mb-3" />`
                }
                <h5 class="card-title task__card__title">${title}</h5>
                <div class="tags text-white d-flex flex-wrap">
                    <span class="badge bg-primary my-1">${type}</span>
                </div>
                <p class="description trim-3-lines text-muted">${description}</p>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" onclick={this.openTask} id=${id}>Open Task</button>
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
                `<img width="100%" src=${url} alt="card img" class="img-fluid place__holder__image mb-3" />`
                : `<img width="100%" src="https://th.bing.com/th/id/OIP.F00dCf4bXxX0J-qEEf4qIQHaD6?w=326&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="card img" class="img-fluid place__holder__image mb-3" />`
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
    state.taskList.map(({id, url, title, type, description}) => {
        // if (taskContent) { // Check if taskContent is not null
        // }
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent({id, url, title, type, description}));
    });
};

// when we update or edit we need to save
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

const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id}) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
};