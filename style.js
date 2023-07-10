var forms = document.querySelectorAll('.validate');
for (var i = 0; i < forms.length; i++){
    forms[i].setAttribute('novalidate', true);
}

var hasError = function(field) {

    document.getElementById("message").maxLength = "1500";

    if(field.type === 'submit' || field.type === 'button') return;

    var validity = field.validity;
    
    if(validity.valid) return;
    
    if(validity.valueMissing) return 'Please fill out field.';

    if(validity.typeMismatch) {
        if(field.type === 'email') return 'Please enter a valid email address with the @ symbol and domain.';
    }

    if(validity.tooLong) return 'Your entry should be no more than ' + field.getAttribute('maxlength') + ' characters. You currently have ' + field.value.length + ' characters.';

    return 'The value you entered is not valid.'
};

var showError = function(field, error) {
    field.classList.add('error');

    var id = field.id || field.name;
    if (!id) return;

    var message = field.form.querySelector('.error-message#error-for-' + id );
    if(!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        message.id = 'error-for-' + id;

        var label;
        if(field.type === 'radio' || field.type === 'checkbox') {
            field.form.querySelection('label[for="' + id + '"]') || field.parentNode;
            if(label) {
                label.parentNode.insertBefore(message, label.nextSibling);
            }
        }

        if(!label) {
            field.parentNode.insertBefore(message, field.nextSibling);
        }
    }

    field.setAttribute('aria-dsecribedby', 'error-for-' + id);

    message.innerHTML = error;

    message.style.display = 'block';
    message.style.visibility = 'visible';
}

var removeError = function (field) {
    field.classList.remove('error');

    field.removeAttribute('aria-describedby');

    var id = field.id || field.name;
    if(!id) return;

    var message = field.form.querySelecgor('.error-message-for-' + id + '');
    if(!message) return;

    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
};

document.addEventListener('blur', function (event){
    if(!event.target.form.classList.contains('validate')) return;

    var error = hasError(event.target);

    if(error) {
        showError(event.target, error);
        return;
    }
    
    removeError(event.target);

}, true);

document.addEventListener('submit', function(event) {
    if(!event.target.classList.contains('validate')) return;

    var fields = event.target.elements;

    var error, hasErrors;
    for(var i = 0; i < fields.length; i++) {
        error = hasError(fields[i]);
        if(error) {
            showError(fields[i], error);
            if(!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }

    if(hasErrors){
        event.preventDefault();
        hasErrors.focus();
    }

}, false);