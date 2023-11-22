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
        <div class="card shadow-sm task_contents">
            <div class="card-header d-flex justify-content-end task__card_header">
                <button type="button" class="btn btn-outline-info mr-2" name=${id}>
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id}>
                    <i class="fas fa-trash-can" name=${id}></i>
                </button>
            </div>

            <div class="card-body">
                ${
                    url &&
                    `<img width="100%" src=${url} alt="card img" class="card-img-top md-3 rounded-lg" />`
                }
                <h5 class="cardd-title task__card_title">${title}</h5>
                <p class="description trim-3-lines text-muted">${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                    <span class="badge bg-primary m-1">${type}</span>
                </div>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask">Open Task</button>
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
                url && 
                `<img width="100%" src=${url} alt="modal img" class="img-fluid mb-3" />`
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
            tasks: state.taskList
        })
    );
};

//convert STRING > JSON for rendering the cards on the screen
const loadInitialData = () => {
    const localStoragecopy = JSON.parse(localStorage.task); //method to convert STRING > JSON

    // check if localStorageCopy have some value
    if(localStoragecopy) state.taskList = localStoragecopy.tasks;

    // now MAP the taskList[] accordingly
    state.taskList.map((cardDate) => {
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
};

// when we update or edit we need to save
const handleSubmit = (event) => {
    console.log("Event triggered !!")
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imgURL").value,
        title: document.getElementById("taskTitle").value,
        tags: document.getElementById("tags").value,
        taskDescription: document.getElementById("taskDescription").value
    };
    taskContent.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({...input, id})
    );
    state.taskList.push({...input, id});
    updateLocalStorage();
};