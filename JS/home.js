const allBtn = document.getElementById("all-btn")
const openBtn = document.getElementById("open-btn")
const closeBtn = document.getElementById("closed-btn")

const issueCount = document.getElementById("issue-count")

const allIssueContainer = document.getElementById("all-issues-container")
const allOpenContainer = document.getElementById("all-open-container")
const allClosedContainer = document.getElementById("all-closed-container")

const issueModal = document.getElementById("issue_modal")

const modalBox = document.getElementById("modal-box")

const modalName = document.querySelector('.name')
const modalStatus = document.querySelector('.statuss')

const snipperSection = document.getElementById("snipper-section")


const activeStatus = async (id) => {
    allBtn.classList.remove("btn-primary")
    openBtn.classList.remove("btn-primary")
    closeBtn.classList.remove("btn-primary")

    document.getElementById(id).classList.add("btn-primary")

    await allIssues();

    if (id === "open-btn") {
        allIssueContainer.classList.add("hidden")
        allOpenContainer.classList.remove("hidden")
        allClosedContainer.classList.add("hidden")
        issueCount.innerText = allOpenContainer.children.length
    } else if (id === "all-btn") {
        allIssueContainer.classList.remove("hidden")
        allOpenContainer.classList.add("hidden")
        allClosedContainer.classList.add("hidden") 
        issueCount.innerText = allIssueContainer.children.length
    } else if (id === "closed-btn") {
        allClosedContainer.classList.remove("hidden")
        allIssueContainer.classList.add("hidden")
        allOpenContainer.classList.add("hidden")
        issueCount.innerText = allClosedContainer.children.length
    }
}

function snipper(id) {
    if (id === true) {
        snipperSection.classList.remove("hidden")
    } else if (id === false) {
        snipperSection.classList.add("hidden")
    }
}

async function allIssues() {
    snipper(true)

    allIssueContainer.innerHTML = "";
    allOpenContainer.innerHTML = "";
    allClosedContainer.innerHTML = "";

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    data.data.forEach(issue => {
        allIssueContainer.appendChild(createIssueDiv(issue));

        if (issue.status === "open") {
            allOpenContainer.appendChild(createIssueDiv(issue));
        } else if (issue.status === "closed") {
            allClosedContainer.appendChild(createIssueDiv(issue));
        }
    });

    issueCount.innerText = allIssueContainer.children.length;
    snipper(false)
}

function createIssueDiv(issue) {
    const div = document.createElement("div");
    div.setAttribute("onclick", `allIssuesModal(${issue.id})`)
    div.className = "bg-base-100 p-3 rounded-sm space-y-2 h-full shadow-sm border-t-4 " +
        (issue.status === "open" ? "border-green-500" : "border-purple-500");
    div.innerHTML = `
        <div class="flex justify-between">
            <i class="fa-regular ${issue.status === "open" ? "text-green-600  fa-solid fa-spinner" : "text-purple-500  fa-circle-check"}"></i>
            <p class = " ${issue.priority === "high" ? 'badge badge-soft px-6 badge-error' : issue.priority === 'medium' ? 'badge badge-soft badge-warning' : 'badge bg-base-200 px-6'}">${issue.priority}</p>
        </div>
        <p class="text-xl font-bold">${issue.title}</p>
        <p class="line-clamp-2">${issue.description}</p>
        <div class="levels-container flex gap-2"></div>
        <hr>
        <p>#${issue.author}</p>
        <p>${issue.createdAt.slice(0, 10)}</p>
    `;
    const levelContainer = div.querySelector(".levels-container")
    level(issue.labels, levelContainer)
    return div;
}


function level(labels, container) {
    labels.forEach(item => {
        const btn = document.createElement("button")
        btn.className = `${item === "bug" ? "badge badge-soft badge-error" : item === "help wanted" ? "badge badge-soft badge-warning" : item === 'good first issue' ? 'badge badge-soft badge-info' : "badge badge-soft badge-success"}`
        btn.innerText = item
        container.appendChild(btn)
    })
}

async function allIssuesModal(id) {
    modalBox.innerHTML = ''

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json()
    const dataContainer = data.data

    const modal = document.createElement("div")
    modal.className = " space-y-3"
    modal.innerHTML = `
    <h3 class="name text-2xl font-bold">${dataContainer.title}</h3>
                <div class=" flex gap-2">
                    <p class = "${dataContainer.status === "open" ? 'badge badge-success' : 'badge badge-primary'}">${dataContainer.status}</p>
                    <p>Open by: <span class="assignee">${dataContainer.assignee}</span></p>
                    <p>${dataContainer.createdAt.slice(0, 10)}</p>
                </div>
                <div class="labels-modal-container">
                    
                </div>
                <p >${dataContainer.description}</p>

                <div class = " bg-base-200 p-3 grid grid-cols-2">
                    <div>
                        <p class="font-bold">Assignee</p>
                        <p >${dataContainer.assignee}</p>
                    </div>
                    <div>
                        <p class=" font-bold">Priority</p>
                        <p class = " ${dataContainer.priority === "high" ? 'badge  px-6 badge-error' : dataContainer.priority === 'medium' ? 'badge  badge-warning' : 'badge badge-success bg-base-200 px-6'}">${dataContainer.priority}</p>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
    `

    modalBox.appendChild(modal)

    const labelModalContainer = modal.querySelector(".labels-modal-container")
    level(dataContainer.labels, labelModalContainer)

    issueModal.showModal()
}

document.getElementById("search-btn").addEventListener("click", async () => {
    const input = document.getElementById("input-text");
    const inputValue = input.value.trim().toLowerCase();

    input.value = ''

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    const allData = data.data;

    const filteredData = allData.filter(issue => issue.title.toLowerCase().includes(inputValue));
    allIssueContainer.innerHTML = ''
    allOpenContainer.innerHTML = ''
    allClosedContainer.innerHTML = ''

    filteredData.forEach(issue => {

        issueDiv = createIssueDiv(issue)
        allIssueContainer.appendChild(issueDiv)
        if (issue.status === "open") {
            allOpenContainer.appendChild(createIssueDiv(issue));
        } else if (issue.status === "closed") {
            allClosedContainer.appendChild(createIssueDiv(issue));
        }
    })
    issueCount.innerText = allIssueContainer.children.length

})
allIssues()