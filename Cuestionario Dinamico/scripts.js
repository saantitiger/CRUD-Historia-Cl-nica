const questionsDiv = document.getElementById('questions');
const answersDiv = document.getElementById('answers');
const addQuestionButton = document.getElementById('addQuestion');
const submitButton = document.getElementById('submit');
let questions = {};

function createQuestionElement(questionId, questionType) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('mb-3');
    questionContainer.id = `questionContainer${questionId}`;

    const questionLabel = document.createElement('label');
    questionLabel.classList.add('form-label');
    questionLabel.setAttribute('for', `question${questionId}`);
    questionLabel.textContent = `Pregunta ${questions[questionId].number}`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-question');
    deleteButton.setAttribute('data-question', questionId);
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => deleteQuestion(questionId));

    const questionInput = document.createElement('input');
    questionInput.classList.add('form-control');
    questionInput.id = `question${questionId}`;
    questionInput.type = 'text';
    questionInput.required = true;

    questionContainer.appendChild(questionLabel);
    questionContainer.appendChild(deleteButton);
    questionContainer.appendChild(questionInput);

    questionsDiv.appendChild(questionContainer);

    if (questionType === 'text') {
        addTextQuestion(questionId);
    } else if (questionType === 'trueFalse') {
        addTrueFalseQuestion(questionId);
    } else if (questionType === 'multipleChoice') {
        addMultipleChoiceQuestion(questionId);
    }
}

function addQuestion(questionType) {
    const questionId = generateUUID();
    const questionNumber = Object.keys(questions).length + 1;
    questions[questionId] = { type: questionType, number: questionNumber };

    createQuestionElement(questionId, questionType);
}

function deleteQuestion(questionId) {
    const questionNumber = questions[questionId].number;
    delete questions[questionId];

    const questionContainer = document.getElementById(`questionContainer${questionId}`);
    questionContainer.remove();

    const answerDiv = document.getElementById(`answer${questionId}`);
    if (answerDiv) {
        answerDiv.remove();
    }

    const separatorDiv = document.getElementById(`separator${questionId}`);
    if (separatorDiv) {
        separatorDiv.remove();
    }

    // Eliminar opciones (si existen)
    const optionsDiv = document.getElementById(`options${questionId}`);
    if (optionsDiv) {
        optionsDiv.remove();
    }

    updateQuestionNumbers();

}

function updateQuestionNumbers() {
    const questionContainers = document.querySelectorAll('.mb-3');
    questionContainers.forEach((container, index) => {
        const questionId = container.id.replace('questionContainer', '');
        const questionNumber = index + 1;
        const questionLabel = container.querySelector('label');
        questionLabel.textContent = `Pregunta ${questionNumber}`;

        // Actualizar también el atributo data-question del botón de eliminar
        const deleteButton = container.querySelector('.delete-question');
        deleteButton.setAttribute('data-question', questionId);
    });
}


addQuestionButton.addEventListener('click', () => {
    $('#questionModal').modal('show');
});

document.getElementById('confirmQuestionType').addEventListener('click', () => {
    const questionType = document.getElementById('questionTypeSelector').value;
    addQuestion(questionType);
    $('#questionModal').modal('hide');
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function addTextQuestion(questionId) {
    const answerDiv = document.createElement('div');
    answerDiv.id = `answer${questionId}`;

    const answerLabel = document.createElement('label');
    answerLabel.setAttribute('for', `answer${questionId}`);
    answerLabel.classList.add('form-label');
    answerLabel.textContent = 'Respuesta:';

    const answerInput = document.createElement('input');
    answerInput.classList.add('form-control');
    answerInput.id = `answer${questionId}`;
    answerInput.setAttribute('data-question', questionId);
    answerInput.type = 'text';
    answerInput.required = true;

    answerDiv.appendChild(answerLabel);
    answerDiv.appendChild(answerInput);

    const separatorDiv = document.createElement('div');
    separatorDiv.id = `separator${questionId}`;
    separatorDiv.innerHTML = '<hr>';

    questionsDiv.appendChild(answerDiv);
    questionsDiv.appendChild(separatorDiv);
}

function addTrueFalseQuestion(questionId) {
    const answerDiv = document.createElement('div');
    answerDiv.id = `answer${questionId}`;

    const answerLabel = document.createElement('label');
    answerLabel.classList.add('form-label');
    answerLabel.textContent = 'Respuesta:';

    const trueInput = document.createElement('input');
    trueInput.id = `true${questionId}`;
    trueInput.type = 'radio';
    trueInput.name = `answer${questionId}`;
    trueInput.value = 'true';
    trueInput.setAttribute('data-question', questionId);

    const trueLabel = document.createElement('label');
    trueLabel.setAttribute('for', `true${questionId}`);
    trueLabel.textContent = 'Verdadero';

    const falseInput = document.createElement('input');
    falseInput.id = `false${questionId}`;
    falseInput.type = 'radio';
    falseInput.name = `answer${questionId}`;
    falseInput.value = 'false';
    falseInput.setAttribute('data-question', questionId);

    const falseLabel = document.createElement('label');
    falseLabel.setAttribute('for', `false${questionId}`);
    falseLabel.textContent = 'Falso';

    answerDiv.appendChild(answerLabel);
    answerDiv.appendChild(document.createElement('br'));
    answerDiv.appendChild(trueInput);
    answerDiv.appendChild(trueLabel);
    answerDiv.appendChild(document.createElement('br'));
    answerDiv.appendChild(falseInput);
    answerDiv.appendChild(falseLabel);

    const separatorDiv = document.createElement('div');
    separatorDiv.id = `separator${questionId}`;
    separatorDiv.innerHTML = '<hr>';

    questionsDiv.appendChild(answerDiv);
    questionsDiv.appendChild(separatorDiv);
}

////////////////////////// Multiple Choice //////////////////////////
function addMultipleChoiceQuestion(questionId) {
    const answerDiv = document.createElement('div');
    answerDiv.id = `answer${questionId}`;

    const answerLabel = document.createElement('label');
    answerLabel.classList.add('form-label');
    answerLabel.textContent = 'Opciones de respuesta:';

    const optionsDiv = document.createElement('div');
    optionsDiv.id = `options${questionId}`;

    const addOptionButton = document.createElement('button');
    addOptionButton.classList.add('btn', 'btn-secondary');
    addOptionButton.id = `addOption${ questionId }`;
    addOptionButton.textContent = 'Agregar opción';

    addOptionButton.addEventListener('click', () => addOption(questionId));

    answerDiv.appendChild(answerLabel);
    answerDiv.appendChild(optionsDiv);
    answerDiv.appendChild(addOptionButton);

    const separatorDiv = document.createElement('div');
    separatorDiv.id = `separator${questionId}`;
    separatorDiv.innerHTML = '<hr>';

    questionsDiv.appendChild(answerDiv);
    questionsDiv.appendChild(separatorDiv);
}

function addOption(questionId) {
    const optionsDiv = document.getElementById(`options${ questionId }`);
    const optionNumber = optionsDiv.children.length + 1;
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('input-group', 'mb-3');

    const optionInput = document.createElement('input');
    optionInput.classList.add('form-control', 'option');
    optionInput.id = `option${questionId}_${optionNumber}`;
    optionInput.required = true;

    const optionCheck = document.createElement('div');
    optionCheck.classList.add('input-group-text');
    optionCheck.innerHTML = '<input type="checkbox" class="form-check-input">';

    const deleteOptionButton = document.createElement('button');
    deleteOptionButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-option');
    deleteOptionButton.setAttribute('data-question', questionId);
    deleteOptionButton.setAttribute('data-option', optionNumber);
    deleteOptionButton.textContent = 'X';

    deleteOptionButton.addEventListener('click', () => deleteOption(questionId, optionNumber));

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(optionCheck);
    optionDiv.appendChild(deleteOptionButton);

    optionsDiv.appendChild(optionDiv);
}

function deleteOption(questionNumber, optionNumber) {
    const optionDiv = document.getElementById(`option${questionNumber}_${optionNumber}`).parentNode;
    optionDiv.remove();
}
////////////////////////// Multiple Choice //////////////////////////

////////////////////////// Submit //////////////////////////
submitButton.addEventListener('click', () => {
    let answers = '';
    Object.keys(questions).forEach((questionId, index) => {
        const questionType = questions[questionId].type;
        let answer;
        if (questionType === 'text') {
            const answerInput = document.querySelector(`input#answer${ questionId }`);
            answer = answerInput.value;
        } else if (questionType === 'trueFalse') {
            const trueRadio = document.getElementById(`true${ questionId }`);
            const falseRadio = document.getElementById(`false${ questionId }`);
            answer = trueRadio.checked ? trueRadio.value : falseRadio.value;
        } else if (questionType === 'multipleChoice') {
            const checkboxes = document.querySelectorAll(`#options${ questionId } input[type=checkbox]:checked`);
            answer = Array.from(checkboxes).map(checkbox => checkbox.parentNode.previousSibling.value).join(', ');
        }
        answers += `Pregunta ${ index + 1 }: ${ answer } \n`;
    });
    answersDiv.innerText = answers;
});
////////////////////////// Submit //////////////////////////