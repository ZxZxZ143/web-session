window.addEventListener('DOMContentLoaded', loadCurrentPage)
window.addEventListener('popstate', loadCurrentPage)


async function loadCurrentPage() {
    let currentPage = window.location.href.split('?')[1];

    if (currentPage === undefined) currentPage = "dashboard";

    let XML_request = new XMLHttpRequest();
    XML_request.open('POST', `pages/${currentPage}.html`, false);
    XML_request.onload = function () {
        let container = document.querySelector(".main_side");
        container.innerHTML = XML_request.responseText;

        let scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            let newScript = document.createElement("script");
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            if (document.querySelector(`body > [src="${oldScript.src}"]`) === null) {
                document.body.appendChild(newScript);
                oldScript.remove();
            }
        });
    }
    XML_request.send();
    if (document.cookie.indexOf('=') !== -1) {
        switch (currentPage) {
            case "dashboard":
                try {
                    expensesLoad();
                } catch (e) {

                }
                break;
            case "categories":
                try {
                    loadCategories();
                } catch (e) {

                }
                break;
            case "addNewCategory":
                try {
                    loadIcons();
                } catch (e) {

                }
                break;
            case "addTransaction":
                try {
                    loadCategoriesForm();
                } catch (e) {

                }
                break;
            case "wallet":
                try {
                    loadBalance();
                } catch (e) {

                }
                break;
        }
    }


    if (document.cookie.indexOf('=') !== -1 && (currentPage === "registration" || currentPage === "logIn")) redirectToIndex();
    if (document.cookie.indexOf('=') === -1 && window.location.href.split('?')[1] === "settings") goToPage("registration");
}


function goToPage(page, replace = false) {
    if (replace) history.replaceState(null, null, `?${page}`);
    else history.pushState(null, null, `?${page}`);
    loadCurrentPage();
}

function redirectToIndex() {
    goToPage('dashboard', true);
}

function hideAlert(alert) {
    alert.classList.add("alert-animation-hide")
    let remove = (alert) => {
        alert.remove()
    }
    setTimeout(remove, 550, alert);

}

function showAlertSuccess(message = 'alert') {
    let alert = document.createElement('div');
    alert.classList.add("alert");
    alert.classList.add("alert-animation-show");
    alert.classList.add("alert-success");
    alert.innerHTML = ` 
        <p class="alert-message">${message}</p>
    `;
    document.querySelector('.alert-container').prepend(alert);
    setTimeout(hideAlert, 3000, alert);
}

function showAlertDanger(message) {
    let alert = document.createElement('div');
    alert.classList.add("alert");
    alert.classList.add("alert-animation-show");
    alert.classList.add("alert-danger");
    alert.innerHTML = ` 
        <p class="alert-message">${message}</p>
    `;
    document.querySelector('.alert-container').prepend(alert);
    setTimeout(hideAlert, 3000, alert);
}