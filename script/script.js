// обработчик событий, который отслеживает закгузку контента
document.addEventListener("DOMContentLoaded", function() {
    const btnOpenModal = document.querySelector("#btnOpenModal");
    const modalBlock = document.querySelector("#modalBlock");
    const closeModal = document.querySelector("#closeModal");
    const questionTitle = document.querySelector("#question");
    const formAnswers = document.querySelector("#formAnswers");
    const prevButton = document.querySelector("#prev");
    const nextButton = document.querySelector("#next");
    const sendButton = document.querySelector("#send");

    // функция получения данных
    const getData = () => {
        formAnswers.textContent = 'LOAD';

        nextButton.classList.add("d-none");
        prevButton.classList.add("d-none");

        setTimeout(() => {
            fetch('./questions.json')
                .then(res => res.json())
                .then(obj => playTest(obj.questions))
                .catch(err => {
                    formAnswers.textContent = "Ошибка загрузки данных!"
                })
        }, 500);
    }

    // открывает модальное окно
    btnOpenModal.addEventListener("click", () => {
        modalBlock.classList.add("d-block");
        getData();
    });

    // закрывает модальное окно
    closeModal.addEventListener("click", () => {
        modalBlock.classList.remove("d-block");
    });

    // функция запуска тестирования
    const playTest = (questions) => {
        const finalAnswers = [];
        //переменная с номером вопроса
        let numberQuestion = 0;
        // функция перебирает масив з ответами, и динамичиски выводит их на страницу
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer, index, arr) => {
                const answerItem = document.createElement("div");

                answerItem.classList.add("answers-item", "d-flex", "justify-content-center");

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                    `;
                formAnswers.appendChild(answerItem);
            });
        };
        // функция рендинга вопросов + ответов
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = "";
            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextButton.classList.remove("d-none");
                prevButton.classList.remove("d-none");
                sendButton.classList.add("d-none");
            }

            if (numberQuestion === 0) {
                prevButton.classList.add("d-none");
            }

            if (numberQuestion === questions.length) {
                nextButton.classList.add("d-none");
                prevButton.classList.add("d-none");
                sendButton.classList.remove("d-none");
                formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="numberPhone">Введити Ваш номер</label> 
                    <input type="phone" class="form-control" id="numberPhone">
                </div>`;
            }

            if (numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Спасибо за пройдений тест';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block')
                }, 2000);
            }
        };
        // запуск функции рендинга
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};

            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            });

            finalAnswers.push(obj)

        };

        // обработчики событий кнопок next и prev
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            console.log(finalAnswers);
        }
    };
});