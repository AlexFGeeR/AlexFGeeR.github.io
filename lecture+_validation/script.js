// И так поговорим о переиспользовании кода.
// Если вы были очень внимательны, то могли заметить что каждый раз работая с формой мы получали сначала её элементы.
// Этот процесс можно вынести в отдельную функцию, чем можно улучшить наш код.
// Давайте напишем её.


// Работа с регистрацией
(function() {
    const signUpForm = document.forms.signUp;

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const body = getAll(signUpForm);

        let error = {};
        // Добавим проверку для устранения бага на наличие ошибок.
        // Для этого создадим переменную в которой будем ловить все элементы с классом invalid-feedback именно этим классом у нас обладают ошибки.
        const errors = document.querySelectorAll('.invalid-feedback');
        if (errors) {
            // Внутри условия которое отработает при наличии таких элементов. Мы будем перебирать цикл этих элементов удаляя каждый из них.
            for (let error of errors) {
                error.remove();
            }
        }

        // проведем проверки на валидность.
        if(!isEmailValid(body.email)) error.email = 'Некорректный e-mail адрес.';
        if(body.name < 2) error.name = 'Слишком короткое имя пользователя.';
        if(body.password < 6) error.password = 'Слишком короткий пароль';
        if(!body.accepnt) error.accepnt = 'Требуется выбрать пункт';
        if(body.accepnt === 'no') error.accepnt = 'Требуется согласится';

        if(Object.keys(error).length) {
            // перебор массива ключей объекта error
            Object.keys(error).forEach((key) => {
                const messageError = error[key]; // помещаем содержимое свойства в переменную.
                const input = signUpForm.elements[key]; // находим элемент в верстке по ключу.
                setError(input, messageError); // функция распределитель.
            })
            return;
        }
        // финальная дата.
        const data = {
            email: body.email,
            password: body.password,
            name: body.name,
            accepnt: body.accepnt,
            avatar: body.avatar,
        }
        console.log(data);
    })


})();


// Данная фукиця будет являться 'сборщиком' данных со всех наших инпутов и текстовых полей внутри формы. Таким образом, мы сможем переиспользовать код получения этих элементов.
function getAll(form) {
    let body = {}; // создаем объект, который будем наполнять инпутами и потом отправлять в качестве результата работы фукнции.
    const inputs = form.querySelectorAll('input');
    const textareas = form.querySelectorAll('textarea');
    for (let input of inputs) {
        switch (input.type) {
            case 'radio': {
                if(input.checked) body[input.name] = input.value;
                break;
            }
            case 'checkbox': {
                if(!body[input.name]) body[input.name] = [];
                if(input.checked) body[input.name].push(input.value);
                break;
            }
            case 'file': {
                body[input.name] = input.files;
            }
            default: {
                body[input.name] = input.value;
            }
        }
    }

    for(let textarea of textareas) {
        body[textarea.name] = textarea.value;
    }
    return body;
}


// функция распределитель.
function setError(input, messageError) {
    // todo объяснение
    /// ????
    if(input[0]) {
        // В данной ветке условия будет работа с радиокнопками, либо чекбоксами.
        setErrorChecked(input, messageError);
    } else {
        // В данном условии будет работа с input'ом принимающим в себя текст: email, password, text...
        setErrorText(input, messageError);
    }
}

// фукнция которая работает с радиокнопками, либо чекбоксами.
function setErrorChecked(inputs, errorMessage) {
    const error = errorCreator(errorMessage);
    inputs[0].parentElement.parentElement.insertAdjacentElement('afterend', error);
    
    for(let input of [...inputs]) {
        input.classList.add('is-invalid');
        function handler() {
            error.remove();
            for(let input of [...inputs]) {
                input.removeEventListener('input', handler);
                input.classList.remove('is-invalid');
            }
        }
        for(let input of [...inputs]) {
            input.classList.add('is-invalid');

            input.addEventListener('input', handler);
        }
    }
}

// фукнция, которая будет работать при работе с инпутом принимающим в себя текст.
function setErrorText(input, errorMessage) {
    const error = errorCreator(errorMessage); // кладём в переменную подготовленный контейнер под ошибку.
    input.classList.add('is-invalid');  // ставим инпуту в котором возникла ошибка класс для изменения его внешнего вида.
    input.insertAdjacentElement('afterend', error); // Добавляем наш контейнер с ошибкой в вёрстку.
    // вешаем слушатель, который отработает при изменении содержимого input'а.
    input.addEventListener('input', function() {
        error.remove(); // удаляем ошибку.
        input.classList.remove('is-invalid'); // удаляем класс внешнего вида ошибки с инпута.
    }, {once: true});
    // Объект options со свойством once будет выполнять условие того, что обработчик вызываться будет лишь один раз, и будет автоматически удалятся при вызове.
}

// функция отвечающая за создание контейнера с ошибкой.
function errorCreator(message) {
    let messageError = document.createElement('div');
    messageError.classList.add('invalid-feedback');
    messageError.innerText = message;
    return messageError;
}

function isEmailValid(email) {
    return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
}