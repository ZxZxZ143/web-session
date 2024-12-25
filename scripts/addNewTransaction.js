loadCategoriesForm();


function submitNewTransaction(e) {
    e.preventDefault();

    if (document.querySelector('[name="category"]:checked') === null) {
        showAlertDanger("Category must be picked");
        return;
    }

    let teg = document.getElementById("teg");
    if (teg.value.length > 20) {
        showAlertDanger("Maximum length 20 characters");
        return;
    }

    let comment = document.getElementById("comment");
    if (comment.value.length > 100) {
        showAlertDanger("Maximum length 100 characters");
    }

    let formData = new FormData(e.target);
    formData = Object.fromEntries(formData);

    fetch("http://localhost/web_session/back-end/addNewTransaction.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(res => res.json())
        .then(data => {
            if (data === "success") {
                showAlertSuccess("Transaction successfully added!");
                goToPage("dashboard");
            } else {
                showAlertDanger('Operation failed( Try later');
            }
        })

}

function loadCategoriesForm(){
    fillDate();
    deletePreviousCategoriesForm();
    let categories = new Map();
    fetch("http://localhost/web_session/back-end/getCategoriesData.php")
        .then(response => response.json())
        .then(data => {
            if (data === "error") {
                showAlertDanger("You need to log in!");
                return;
            }
            data.forEach(element => {
                categories.set(element.category_id, new CategoryForm(element.category_id, element.icon, element.category));
            })

            for (let [key, category] of categories) {
                category.addCategoryOnPage();
            }
        })
}

function fillDate() {
    let today = document.querySelector(".todayDate");
    let yesterday = document.querySelector(".yesterdayDate");
    let custom = document.querySelector(".customDate");

    let date = new Date();
    today.innerText = date.toDateString();
    document.getElementById("today").value = parseDateToString(date);
    date.setDate(date.getDate() - 1)
    yesterday.innerText = date.toDateString();
    document.getElementById("yesterday").value = parseDateToString(date);;
    date.setDate(date.getDate() - 1)
    custom.innerText = date.toDateString();
    document.getElementById("custom").value = parseDateToString(date);;
}

function deletePreviousCategoriesForm(){
    document.querySelector('.icons-container').innerHTML = '';
}

function datePicker() {
    flatpickr("#datePicker", {
        dateFormat: "Y-m-d",
        onReady: (selectedDates, dateStr, instance) => {
            instance.open(); // Автоматически открывает календарь
        },
        onChange: (selectedDates, dateStr, instance) => {
            let pickedDate = new Date(dateStr);
            if (new Date().getTime() < pickedDate.getTime()) {
                console.log(pickedDate)
                showAlertDanger("Wrong date");
                return;
            }
            let custom = document.querySelector(".customDate");
            custom.innerText = pickedDate.toDateString();
            document.getElementById("custom").value = parseDateToString(pickedDate);
        }
    });


}

function parseDateToString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

class CategoryForm {
    constructor(id, icon, name) {
        this.id = id;
        this.icon = icon;
        this.name = name;
    }

    addCategoryOnPage() {
        let newCategory = document.createElement("div");
        newCategory.style.height = 'fit-content';
        newCategory.dataset.id = this.id;
        newCategory.innerHTML = `
        <input type="radio" id="${this.id}" name="category" value="${this.id}">
        <label for="${this.id}" class="icon-label">
            <div class="category-icon"><i class="material-icons">${this.icon}</i></div>
            <p>${this.name}</p>
        </label>`

        document.querySelector('.icons-container').appendChild(newCategory);
    }
}