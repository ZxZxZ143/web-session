loadIcons();

function loadIcons(full = false) {
        fetch(`http://localhost/web_session/back-end/getIcons.php?full=${full}`)
            .then(r => r.json())
            .then(data => {
                if (full) {
                    data.forEach((icon) => {
                        new Icon(icon).addIconOnPage();
                    });
                } else {
                    data.forEach((icon) => {
                        new Icon(icon.icon).addIconOnPageRadio();
                    });
                    addMoreIconsButton();
                }
            })
}

function pickIcon(e) {
    new Icon(e.target.innerText).addIconOnPageRadioChecked();
    closeIconWindow(true);
}

function validation(e) {
    let input = e.target;
    input.classList.add('validation');

    if (!input.validity.valid && input.value.length < 1) {
        input.setCustomValidity('This field must contain at least 1 characters.');
        input.reportValidity();
    } else if (!input.validity.valid && input.value.length > 20) {
        input.setCustomValidity('This field must contain maximum 20 characters.');
        input.reportValidity();
    } else {
        input.setCustomValidity(''); // Убираем сообщение об ошибке, если поле заполнено
    }
}

function addMoreIconsButton(){
    let el = document.createElement('div');
    el.classList.add("category");
    el.onclick = expenseIcons;
    el.innerHTML = `
                <div class="category-icon">
                    <i class="material-icons">more_horiz</i>
                </div>
                <p class="category-name">more</p>`
    document.querySelector('.icons-container').appendChild(el);
}

function expenseIcons() {
    document.querySelector('.windowWrapper-icons').style.display = 'flex';

    loadIcons(true);
}

function closeIconWindow(e, close = false) {
    if (e.target === e.currentTarget || e.currentTarget === document.querySelector(".close-window") || close) {
        document.querySelector('.windowWrapper-icons').style.display = 'none';
    }
}

function submitCategory(e) {
    e.preventDefault();

    if (document.querySelector('[name="icon"]:checked') === null) {
        showAlertDanger("Icon must be picked");
        return;
    }

    let form = e.target;

    let formData = new FormData(form);
    formData = Object.fromEntries(formData);

    fetch("http://localhost/web_session/back-end/addNewCategory.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(res => res.json())
        .then(data => {
            if (data === "New record created successfully") {
                showAlertSuccess('New category added!');
                goToPage("categories");
            } else {
                showAlertDanger('Operation failed( Try later');
            }
        })
}

class Icon {
    constructor(icon) {
        this.icon = icon;
    }

    addIconOnPageRadio() {
        let newIcon = document.createElement("div");
        newIcon.innerHTML = `
        <input type="radio" id="${this.icon}" name="icon" value="${this.icon}">
        <label for="${this.icon}" class="icon-label category-icon">
            <i class="material-icons">${this.icon}</i>
        </label>`

        document.querySelector(".icons-container").appendChild(newIcon);
    }

    addIconOnPageRadioChecked() {
        let newIcon = document.createElement("div");
        newIcon.innerHTML = `
        <input type="radio" id="${this.icon}" name="icon" value="${this.icon}" checked>
        <label for="${this.icon}" class="icon-label category-icon">
            <i class="material-icons">${this.icon}</i>
        </label>`

        document.querySelector(".icons-container").prepend(newIcon);
    }

    addIconOnPage() {
        let newIcon = document.createElement("div");
        newIcon.style.cursor = "pointer";
        newIcon.onclick = () => pickIcon(event);
        newIcon.innerHTML = `
        <div data="${this.icon}" class="icon-label category-icon">
            <i class="material-icons">${this.icon}</i>
        </div>`

        document.querySelector(".icons-container-window").appendChild(newIcon);
    }


}