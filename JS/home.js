const allBtn = document.getElementById("all-btn")
const openBtn = document.getElementById("open-btn")
const closeBtn = document.getElementById("closed-btn")

const issueCount = document.getElementById("issue-count")

const allIssueContainer = document.getElementById("all-issues-container")
const allOpenContainer = document.getElementById("all-open-container")
const allClosedContainer = document.getElementById("all-closed-container")



const activeStatus = (id) => {
    allBtn.classList.remove("btn-primary")
    openBtn.classList.remove("btn-primary")
    closeBtn.classList.remove("btn-primary")

    document.getElementById(id).classList.add("btn-primary")
    if (id === "open-btn") {
        allIssueContainer.classList.add("hidden")
        allOpenContainer.classList.remove("hidden")
        issueCount.innerText = allOpenContainer.children.length
    } else if (id === "all-btn") {
        allIssueContainer.classList.remove("hidden")
        allOpenContainer.classList.add("hidden")
        issueCount.innerText = allIssueContainer.children.length
    } else if (id === "closed-btn") {
        allClosedContainer.classList.remove("hidden")
        allIssueContainer.classList.add("hidden")
        allOpenContainer.classList.add("hidden")
        issueCount.innerText = allClosedContainer.children.length
    }
}



async function allIssues() {
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
}

function createIssueDiv(issue) {
    const div = document.createElement("div");
    div.className = "bg-base-100 p-3 rounded-sm space-y-2 h-full shadow-sm border-t-4 " +
        (issue.status === "open" ? "border-green-500" : "border-purple-500");
    div.innerHTML = `
        <div class="flex justify-between">
            <i class="fa-regular ${issue.status === "open" ? "text-green-600  fa-solid fa-spinner" : "text-purple-500  fa-circle-check"}"></i>
            <p class = " ${issue.priority === "high" ? 'badge badge-soft px-6 badge-error': issue.priority === 'medium'? 'badge badge-soft badge-warning':'badge bg-base-200 px-6'}">${issue.priority}</p>
        </div>
        <p class="text-xl font-bold">${issue.title}</p>
        <p class="line-clamp-2">${issue.description}</p>
        <div class="flex gap-2">
            <p>hh</p>
            <p>hh</p>
        </div>
        <hr>
        <p>#${issue.author}</p>
        <p>${issue.createdAt}</p>
    `;
    return div;
}


allIssues()