if (document.cookie.indexOf("=") !== -1) expensesLoad();

let expenses = new Map();

function expensesLoad() {
    removePreviousExpenses();

    fetch('http://localhost/web_session/back-end/getExpensesData.php')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return;
            for (let el of data) {
                expenses.set(el.expence_id, new Expense(el.expence_id, el.category, el.icon,el.price, el.teg, el.comment, el.date));
            }
            let cur_date = new Date();
            let cur_date_el;
            for (let [key, el] of expenses) {
                if (cur_date.getTime() === new Date(el.date).getTime()) {
                    el.addExpenseOnPage();
                    let count = cur_date_el.dataset.count;
                    cur_date_el.dataset.count = (Number(count) + 1).toString();
                    cur_date_el.dataset.ids += `,${el.id}`
                }
                else {
                    cur_date = new Date(el.date);
                    cur_date_el = addDateOnPage(cur_date);
                    let ids = [el.id];
                    cur_date_el.dataset.ids = ids;
                    el.addExpenseOnPage();
                }
            }
        });
}

function deleteTransaction(id) {
    expenses.get(id.toString()).deleteExpenseOnPage();
    document.querySelectorAll('.date').forEach(el => {
        let ids = el.dataset.ids.split(",");
        if (ids.includes(id.toString())) {
            let count = el.dataset.count;
            el.dataset.count = (Number(count) - 1).toString();
            if (el.dataset.count === '0') {
                el.remove();
            }
            delete ids[ids.indexOf(id.toString())];
            el.dataset.ids = ids.join(",");

            return;
        }
    });
    fetch('http://localhost/web_session/back-end/deleteTransaction.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"id": id})
    }).then(res => res.json())
        .then(data => {
            if (data === "success") {
                showAlertSuccess("Transaction successfully deleted!");
            } else {
                showAlertDanger('Operation failed( Try later');
            }
        })
    expenses.delete(id.toString());
}

function openComment(comment) {
    let modal = document.querySelector('.modal_window_bg');
    modal.style.display = 'flex';

    document.querySelector('.comment').innerText = comment === undefined? "no comment" : comment;
}

function closeComment() {
    let modal = document.querySelector('.modal_window_bg');
    modal.style.display = 'none';
}

function removePreviousExpenses() {
    document.querySelector('.transactions').innerHTML = '';
}

function addDateOnPage(date) {
    let options = { month: "short", day: "numeric", year: "numeric" };
    date = date.toLocaleDateString("en-US", options);

    let d = document.createElement("p");
    d.classList.add("date");
    d.innerText = date;
    d.dataset.count = '1';

    document.querySelector(".transactions").appendChild(d);
    return d;
}

class Expense{
    constructor(id, category, icon, price, teg = "", comment = "", date){
        this.id = id;
        this.category = category;
        this.icon = icon;
        this.price = price;
        this.teg = teg;
        this.comment = comment;
        this.date = date;
        this.transaction = document.createElement("div");
    }

    addExpenseOnPage() {
        this.transaction.classList.add("transaction");
        // this.transaction.dataset.id = this.id;
        this.transaction.innerHTML = `
                  <div class="transaction_info">
                    <div class="transaction_icon">
                      <i class="material-icons">${this.icon}</i>
                    </div>
                    <div class="transaction_text">
                      <p class="transaction_cost">${this.price} USD</p>
                      <p class="transaction_comment ${this.teg === '' ? 'hidden' : ''}">${this.teg}</p>
                    </div>
                  </div>
                  <div class="more_option">
                    <i class="material-icons option info-color" onclick="openComment('${this.comment}')">info</i>
                    <i class="material-icons option edit-color">edit</i>
                    <i class="material-icons option delete-color" onclick="deleteTransaction(${this.id})">delete</i>
                  </div>
                `;

        document.querySelector('.transactions').appendChild(this.transaction);
    }

    deleteExpenseOnPage() {
        this.transaction.remove();
    }
}