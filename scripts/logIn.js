if (document.cookie.indexOf('=') !== -1 && window.location.href.split('?')[1] === "logIn") redirectToIndex();


function submitLogin(e) {
    e.preventDefault();
    console.log(1)

    let formLogin = document.getElementById('login');

    let formData = new FormData(formLogin);

    formData = Object.fromEntries(formData);

    fetch('http://localhost/web_session/back-end/logIn.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(res => res.json())
        .then(data => {
            let input = document.querySelector('#login-login');
            let input2 = document.querySelector('#password-login');
            if (data.message === "wrong data") {
                showAlertDanger("Wrong login or password");
                return;
            }
            if (data.message === "success") {
                showAlertSuccess("Welcome back!");
                localStorage.setItem('login', input.value);
                localStorage.setItem('pass', input2.value);
                goToPage('dashboard', true);
            }
        });
}

function initData(){
    if (document.querySelector('#login-login').value === '') {
        startAnimationForward('login-login', '.placeholder-login-login')
        document.querySelector("#login-login").value = localStorage.getItem('login') || '';
        document.querySelector("#login-login").classList.add('validation');
    }
    if (document.querySelector('#password-login').value === '') {
        startAnimationForward('password-login', '.placeholder-password-login')
        document.querySelector("#password-login").value = localStorage.getItem('pass') || '';
        document.querySelector("#password-login").classList.add('validation');
    }
}

function validation(e) {
    let input = e.target;
    input.classList.add('validation');

    if (!input.validity.valid && input.value.length < 3) {
        input.setCustomValidity('This field must contain at least 3 characters.');
        input.reportValidity();
    } else if (!input.validity.valid && input.value.length > 16) {
        input.setCustomValidity('This field must contain maximum 16 characters.');
        input.reportValidity();
    } else if (!input.validity.valid && input.value.indexOf(' ') !== -1) {
        input.setCustomValidity('This field hasnt`t to contain spaces');
        input.reportValidity();
    }
    else {
        input.setCustomValidity('');
    }
}

