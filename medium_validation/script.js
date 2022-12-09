// Данный уровень будет включать в себя вывод ошибок на экран, но будет не очень хорошо написан с точки зрения структуры. Сделано это для того, чтобы наглядней код выглядел для новичков.


// В этот раз обернем всё в самовызывающуюся функцию (function() {})();
(function() {
    const signInForm = document.forms.signIn;

    // Получим input'ы, но уже другим способом. Мы будем обращаться именно к форме и искать в элементах этой формы конкретные инпуты.
    const emailInput = signInForm.elements.email;
    const passwordInput = signInForm.elements.password;

    // Создаем слушатель события submit.
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault(); // ломаем стандартное поведение при вызове этого события.

        // Дальше нам требуется производить проверку на соответствие валидации.
        let isEmailValid = emailInput.value.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
        let isPasswordValid;

        // Проверка валидности пароля. В нашем случае длина пароля должна быть больше 6
        if (passwordInput.value.length > 6) {
            isPasswordValid = true;
        } else {
            isPasswordValid = false;
        }

        // Создаем контейнер для отображения ошибки или успеха нашей валидации.
        let statusSubmitMessage = document.createElement('div'); // создаем контейнер, который потом будет вставлять в верстку. Сейчас он существует только в рамках нашего js файла.
        
        
        // В зависимости от ошибок заполяем контейнер ошибки и добавляем саму ошибку в верстку.
        if ( isEmailValid && isPasswordValid ) {
            statusSubmitMessage.style.color = 'green';
            statusSubmitMessage.innerText = 'Всё отлично!';
            signInForm.insertAdjacentElement('beforeend', statusSubmitMessage);
        } else {
            statusSubmitMessage.style.color = 'red'; // Задаем стиль текста красный.
            statusSubmitMessage.innerText = 'Ошибка валидации!';
            signInForm.insertAdjacentElement('beforeend', statusSubmitMessage);
        }
    })
})();