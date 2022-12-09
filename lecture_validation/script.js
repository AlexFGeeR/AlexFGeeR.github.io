// Итак, мы подобрались к самому интересному. Код с лекции. Следующий уровень его улучшение с точки зрения переиспользования кода.

// Принцип тот же - все объясненные раннее вещи, я не буду объяснять повторно, если какая-то строчка непонятно, то спускаетесь на уровень ниже. Если не нашли во всех уровнях объяснения того или иного момента, то пишите в личку.

// Стоит подчеркнуть, что здесь мы уже будем более сильно 'прыгать' по файлу организуя переиспользование кода.
// Именно по этой причине вам придется иногда прыгать по файлу, именно для того, чтобы вы не запутались в прошлых уровнях я делал всё более структурированно.

// Функция работы с регистрацией.
(function() {
    const signUpForm = document.forms.signUp; // получаю форму.
    
    
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signUpForm.elements.email;
        const password = signUpForm.elements.password;
        const name = signUpForm.elements.name;
        const avatar = signUpForm.elements.avatar;
        const accepnt = [...signUpForm.elements.accepnt].find(item => item.checked);
        let error = {};


        // Добавим проверку для устранения бага на наличие ошибок.
        // Для этого создадим переменную в которой будем ловить все элементы с классом invalid-feedback именно этим классом у нас обладают ошибки.
        const errors = document.querySelectorAll('.invalid-feedback');
        if (errors) {
            // Внутри условия которое отработает при наличии таких элементов. Мы будем перебирать цикл этих элементов удаляя каждый из них.
            for (error of errors) {
                error.remove();
            }
        }

        if(!accepnt) {
            error.accepnt = 'Пожалуйста выберите пункт.';
        }
        
        if(!isEmailValid(email.value)) {
            error.email = 'Некорректный email';
        }

        if(name.value.length < 2) {
            error.name = 'Введите имя';
        }

        if(password.value.length < 6) {
            error.password = 'Слишком короткий пароль';
        }

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
            email: email.value,
            password: password.value,
            name: name.value,
            accepnt: accepnt.value,
            avatar: avatar.files,
        }
        console.log(data);
    })

})();

// Функция работы с авторизацией.
(function() {
    const signInForm = document.forms.signIn;

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signInForm.elements.email;
        const password = signInForm.elements.password;

        // Добавим проверку для устранения бага на наличие ошибок.
        // Для этого создадим переменную в которой будем ловить все элементы с классом invalid-feedback именно этим классом у нас обладают ошибки.
        const errors = document.querySelectorAll('.invalid-feedback');
        if (errors) {
            // Внутри условия которое отработает при наличии таких элементов. Мы будем перебирать цикл этих элементов удаляя каждый из них.
            for (error of errors) {
                error.remove();
            }
        }

        let error = {};

        if(!isEmailValid(email.value)) {
            error.email = 'Некорректный email';
        }

        if(password.value.length < 6) {
            error.password = 'Слишком короткий пароль';
        }

        if(Object.keys(error).length) {
            // перебор массива ключей объекта error
            Object.keys(error).forEach((key) => {
                const messageError = error[key]; // помещаем содержимое свойства в переменную.
                const input = signInForm.elements[key]; // находим элемент в верстке по ключу.
                setError(input, messageError); // функция распределитель.
            })
            return;
        }

        // финальная дата.
        const data = {
            email: email.value,
            password: password.value,
        }
        console.log(data);
    })
})();


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

// функция на проверку регулярного выражения.
function isEmailValid(email) {
    return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
}