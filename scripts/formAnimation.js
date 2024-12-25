function startAnimationForward(id, selector) {
    if (document.getElementById(id).value === '') {
        document.querySelector(selector).classList.add('animateFormForward');
        document.querySelector(selector).classList.remove('animateFormBackward');
    }
}

function startAnimationBackward(id, selector) {
    if (document.getElementById(id).value === '') {
        document.querySelector(selector).classList.add('animateFormBackward');
        document.querySelector(selector).classList.remove('animateFormForward');
    }
}

function addValidation(e) {
    let el = e.target;
    let input = e.target;
    if (input.classList.contains('form-transaction')) input.classList.add('validation-transaction');
    else input.classList.add('validation');
}
