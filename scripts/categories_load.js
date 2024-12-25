if (document.cookie.indexOf("=") !== -1) loadCategories();


function loadCategories() {
    if (document.cookie.indexOf("=") === -1) return;
    deletePreviousCategories();
    let categories = new Map();
    fetch("http://localhost/web_session/back-end/getCategoriesData.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                categories.set(element.category_id, new Category(element.category_id, element.icon, element.category));
            })

            for (let [key, category] of categories) {
                category.addCategoryOnPage();
            }

            addNewCategoryElement();
        })
}

function deletePreviousCategories() {
    document.querySelector('.categories').innerHTML = '';
}

function addNewCategoryElement() {
    let el = document.createElement('div');
    el.classList.add("category");
    el.classList.add("add_new_category");
    el.innerHTML = `
                <div class="category-icon" onclick="goToPage('addNewCategory')">
                    <i class="material-icons">add</i>
                </div>
                <p class="category-name">Add category</p>`
    document.querySelector('.categories').appendChild(el);
}

class Category {
    constructor(id, icon, name) {
        this.id = id;
        this.icon = icon;
        this.name = name;
    }

    addCategoryOnPage() {
        let newCategory = document.createElement("div");
        newCategory.classList.add("category");
        newCategory.dataset.id = this.id;
        newCategory.innerHTML = `
                <div class="category-icon">
                    <i class="material-icons">${this.icon}</i>
                </div>
                <p class="category-name">${this.name}</p>`

        document.querySelector('.categories').appendChild(newCategory);
    }

    addCategoryOnPageForm() {
        let newCategory = document.createElement("div");
        newCategory.dataset.id = this.id;
        newCategory.innerHTML = `
        <input type="radio" id="${this.id}" name="category" value="${this.id}" required>
        <label for="${this.id}" class="icon-label category-icon">
            <i class="material-icons">${this.icon}</i>
            <p>${this.name}</p>
        </label>`

        document.querySelector('.icons-container').appendChild(newCategory);
    }
}