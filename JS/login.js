const logInBtn = document.getElementById("sign-in-btn")

const userNameInput = document.getElementById("user-name-input")

const passwordInput = document.getElementById("password-input")



// Log in btn addEvenListener
logInBtn.addEventListener("click", () => {
    const userNameValue = userNameInput.value
    const passwordValue = passwordInput.value
    
    if (userNameValue === 'admin' && passwordValue === "admin123") {
        window.location.href = "home.html"
    } else {
        return alert("invalid input")
    }
})