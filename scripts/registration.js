if (document.cookie.indexOf('=') !== -1 && window.location.href.split('?')[1] === "registration") redirectToIndex();

function submitRegistration(e) {
    e.preventDefault();

    let formRegistration = document.getElementById('registration');

    let formData = new FormData(formRegistration);

    formData = Object.fromEntries(formData);

    fetch('http://localhost/web_session/back-end/registration.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(res => res.json())
        .then(data => {
            let input = document.querySelector('#login-registration');
            let input2 = document.querySelector('#password-registration');
            if (data.message === "login already exists") {
                showAlertDanger('Login already exists');
            } else if (data.status === "success") {
                showAlertSuccess("Registration has been successfully");
                localStorage.setItem('login', input.value);
                localStorage.setItem('pass', input2.value);
                goToPage('dashboard', true);
            } else {
                console.log(data.message)
            }
        });
}

function validation(e) {
        let input = e.target;
        input.classList.add('validation');
        const cyrillicPattern = /^[а-яА-ЯёЁ\s]+$/;

        if (!input.validity.valid && input.value.length < 3) {
            input.setCustomValidity('This field must contain at least 3 characters.');
            input.reportValidity();
        } else if (!input.validity.valid && input.value.length > 16) {
            input.setCustomValidity('This field must contain maximum 16 characters.');
            input.reportValidity();
        } else if (!input.validity.valid && input.value.indexOf(' ') !== -1) {
            input.setCustomValidity('This field hasnt`t to contain spaces');
            input.reportValidity();
        }  else {
            input.setCustomValidity('');
        }
}