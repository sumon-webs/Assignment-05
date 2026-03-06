const allBtn = document.getElementById("all-btn")
const openBtn = document.getElementById("open-btn")
const closeBtn = document.getElementById("closed-btn")

const issueCount = document.getElementById("issue-count")

const allIssueContainer = document.getElementById("all-issues-container")

let openIssue = []


const activeStatus = (id) => {
    allBtn.classList.remove("btn-primary")
    openBtn.classList.remove("btn-primary")
    closeBtn.classList.remove("btn-primary")

    document.getElementById(id).classList.add("btn-primary")
}

async function allIssues() {
    allIssueContainer.innerHTML = ""
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()
    data.data.forEach(element => {
        openTab(element.status)
        const div = document.createElement("div")
        div.innerHTML = `
        <div class=" bg-base-100 p-3 rounded-sm space-y-2 h-full shadow-sm">
                    <div class=" flex justify-between">
                        <i class="fa-solid fa-circle text-green-500"></i>
                        <p>${element.priority}</p>
                    </div>
                    <p class = " text-xl font-bold">${element.title}</p>
                    <p class="line-clamp-2">${element.description}</p>
                    <div class=" flex gap-2">
                        <p>hh</p>
                        <p>hh</p>
                    </div>
                    <hr>
                    <p>#${element.author}</p>
                    <p>${element.createdAt}</p>
                </div>
        `
        allIssueContainer.appendChild(div)
    });
    issueCount.innerText = allIssueContainer.children.length
}

function openTab (id) {
    console.log(id);
}

allIssues()