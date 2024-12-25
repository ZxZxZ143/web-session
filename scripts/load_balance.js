loadBalance();

function loadBalance() {

    if (document.cookie.indexOf('=') === -1) {
        document.querySelector('.balance-container').innerHTML = `
        <div class="logIn_alert">
                    <p class="logInNotification">Log in to white your expenses</p>
                    <button class="logInRedirect submit" onclick="goToPage('logIn')">Log in!</button>
                </div>
        `;
    }

    fetch("http://localhost/web_session/back-end/getBalance.php")
        .then(res => res.json())
        .then(data => {
            let balance = document.querySelector(".balance");
            if (data.bank.toString() < 0) balance.style.color = "var(--danger)";
            else balance.style.color = "var(--success)";
            balance.innerText = data.bank;
        })
}

function submitIncome(e) {
    e.preventDefault();

    let formData = new FormData(e.target);

    formData = Object.fromEntries(formData);
    console.log(formData)
    fetch("http://localhost/web_session/back-end/addIncome.php", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                showAlertSuccess('Income successfully added!');
                let balance = document.querySelector(".balance");
                if (data.message.toString() < 0) balance.style.color = "var(--danger)";
                else balance.style.color = "var(--success)";
                balance.innerText = data.message;
            } else {
                showAlertDanger('Operation failed( Try later');
            }
        })
}