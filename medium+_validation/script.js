// ВНИМАНИЕ РАССМАТРИВАТЬ СТРОГО ПО ПОРЯДКУ.
// Начинаем работать с HTML кодом, который мы написали на лекции

// Как делали на предыдущих уровнях - мы находим форму -> вешаем слушатель -> анализируем данные и уже в зависимости от того правильно ли они написаны пишем об успехе или неудаче нашей валидации.

// напишем функцию с помощью которой вынесем нашу логику валидации почты и сможем её переиспользовать. Благодаря этому мы задействуем меньше строчек кода. 
const isEmailValid = (email) => {
    return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
} // Для напоминания темы чистых функций можете задать себе вопрос, а чистая ли это функция)

// Работа с формой авторизации
(function() {
    const form = document.forms.signIn;

    // получаем элементы формы
    const email = form.querySelector('input[name=email]');
    const password = form.elements.password;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // ломаем стандартное поведение.

        // создадим объект в котором будем хранить наши данные
        const data = {
            email: email.value,
            password: password.value,
        }

        // Создадим объект в котором будем хранить наши ошибки.
        let errors = {}; // На данном этапе он у нас будет пустым.

        // выполним валидацию. В ней в случае того что какой-то элемент не проходит валидацию - мы будем наполнять объект errors этими ошибками.
        if(!isEmailValid(data.email)) {
            errors.email = 'Email не прошёл валидацию'; // Создаем в объекте errors ключ email и кладём туда строковое значение с нашей ошибкой.
        }

        if(data.password < 6) {
            errors.password = 'Пароль должен быть больше 6 символов'; // Создаем в объекте errors ключ password и кладём туда строковое значение с нашей ошибкой.
        }

        // При помощи конструкции Object.keys(errors) мы получаем массив ключей нашего объекта и как любому массиву мы можем вызвать свойство length, которое определит его длину.
        if(!Object.keys(errors).length) {
            alert('Ошибок валидации нет!'); 
        } else {
            alert('Ошибки валидации есть. За подробностями в консоль!');
            console.log(errors);
        }

    })
})();

// Работа с формой регистрации. Усложним её по сравнению с работой нашей авторизации.
(function() {
    const signUpForm = document.forms.signUp; // получаем нашу форму.

    // Как можно заметить между получением формы и слушателем отстуствует получение инпутов. Правильно, ведь мы работаем с ними только в событии и поэтому они должны объявлятся там.

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // ломаем стандарнтое поведение формы.
        
        // получаем элементы формы.
        const email = signUpForm.elements.email;
        const password = signUpForm.elements.password;
        const name = signUpForm.elements.name;
        const avatar = signUpForm.elements.avatar;
        // А теперь самое тяжелое из получений. Получим нажатый наш радио input.
        // Как мы помним - мы получаем псевдомассив при работе с ДОМ деревом. Поэтому нам нужно сделать из псевдомассива - простой массив. Сделать это мы можем при помощи параметра расширения: [...signUpFormElements.accepnt] - данная конструкция будет являться массивом с элементами нашего прежнего псевдомассива.. 
        // console.log(signUpForm.elements.accepnt); // Псевдомассив // Расскоментируй для наглядности.
        // console.log([...signUpForm.elements.accepnt]); // Массив элементов из псевдомассива. // Расскоментируй для наглядности.
        const accepnt = [...signUpForm.elements.accepnt].find(item => item.checked);
        
        // создаем объект ошибок.
        let errors = {};

        // Дальше идут условия валидации. Если какое-то условие валидации не соблюдено, то мы вносим сообщение об ошибки в наш объект ошибок.
        if(!accepnt) {
            errors.accepnt = 'Пожалуйста выберите хотя бы один пункт.';
        }
        if(accepnt === 'no') {
            errors.accepnt = 'Примите условия.';
        }
        if(!isEmailValid(email.value)) {
            errors.email = 'Ваша электронная почта не прошла валидацию.';
        }
        if(password.value.length < 6) {
            errors.password = 'Ваш пароль слишком короткий.';
        }
        if(!name.value.length) {
            errors.name = 'Вы должны указать имя';
        }

        if(Object.keys(errors).length) {
            alert('Валидация прошла с ошибкой. Подробности в консоли.');
            console.log(errors);
            return;
        }

        // собираем объект с нашими данными для отправки на сервер.
        const data = {
            email: email.value,
            password: password.value,
            name: name.value,
            accepnt: accepnt.value,
            avatar: avatar.files,
        }
        console.log(data);
        alert('Валидация прошла удачно!');
    })
})();