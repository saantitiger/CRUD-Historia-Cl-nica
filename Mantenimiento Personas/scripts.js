// Version: 1.0

function showModal() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
    });
    myModal.show();
}  

document.getElementById("submit-local").addEventListener("click", function (event) {

    event.preventDefault();
    var name = document.getElementById("name").value;
    var lastname = document.getElementById("lastname").value;
    var mail = document.getElementById("mail").value;

    // Crear objeto paciente con la imagen
    var person = {
        name: name,
        lastname: lastname,
        mail: mail
    };

    var persons = JSON.parse(localStorage.getItem("persons")) || [];
    persons.push(person);
    localStorage.setItem("persons", JSON.stringify(persons));

    displayPersons();

    document.getElementById("person-form").reset(); // Reiniciar el formulario

    // Cerrar el modal
    (bootstrap.Modal.getInstance(document.getElementById('exampleModal'))).hide();
});

document.getElementById("submit-session").addEventListener("click", function (event) {

    event.preventDefault();
    var name = document.getElementById("name").value;
    var lastname = document.getElementById("lastname").value;
    var mail = document.getElementById("mail").value;

    // Crear objeto paciente con la imagen
    var person = {
        name: name,
        lastname: lastname,
        mail: mail
    };

    var persons = JSON.parse(sessionStorage.getItem("persons")) || [];
    persons.push(person);
    sessionStorage.setItem("persons", JSON.stringify(persons));

    displayPersons();

    document.getElementById("person-form").reset(); // Reiniciar el formulario

    // Cerrar el modal
    (bootstrap.Modal.getInstance(document.getElementById('exampleModal'))).hide();
});

document.getElementById('exampleModal').addEventListener('hidden.bs.modal', function () {
    var existingEditButton = document.getElementById("edit-person");
    var existingCancelButton = document.getElementById("cancel-edit");
    var existingModalFooter = document.getElementById("modal-footer");
    if (existingEditButton) existingEditButton.remove();
    if (existingCancelButton) existingCancelButton.remove();
    if (existingModalFooter) existingModalFooter.remove();

    // Resetear el formulario
    document.getElementById("person-form").reset();

    // Mostrar botones de submit local y session
    document.getElementById("submit-local").style.display = "block";
    document.getElementById("submit-session").style.display = "block";
});

function displayPersons() {

    var patients = JSON.parse(localStorage.getItem("persons")) || [];
    var tableBody = document.querySelector("#local-persons tbody");
    tableBody.innerHTML = "";
    patients.forEach(function (person, index) {
        var row = tableBody.insertRow();
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.lastname}</td>
            <td>${person.mail}</td>
            <td>
                <button type="button" class="btn btn-primary" onclick="getPerson(${index}, true)">Ver</button>
                <button type="button" class="btn btn-danger" onclick="deletePerson(${index}, true)">Eliminar</button>
            </td>
        `;
    });
    
    var patients = JSON.parse(sessionStorage.getItem("persons")) || [];
    var tableBody = document.querySelector("#session-persons tbody");
    tableBody.innerHTML = "";
    patients.forEach(function (person, index) {
        var row = tableBody.insertRow();
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.lastname}</td>
            <td>${person.mail}</td>
            <td>
                <button type="button" class="btn btn-primary" onclick="getPerson(${index})">Ver</button>
                <button type="button" class="btn btn-danger" onclick="deletePerson(${index})">Eliminar</button>
            </td>
        `;
    });
}

function getPerson(index, opc = false) {

    if (opc) {
        var persons = JSON.parse(localStorage.getItem("persons")) || [];
    } else {
        var persons = JSON.parse(sessionStorage.getItem("persons")) || [];
    }

    var person = persons[index];

    document.getElementById("name").value = person.name;
    document.getElementById("lastname").value = person.lastname;
    document.getElementById("mail").value = person.mail;

    // Cambiar los botones en el modal
    document.getElementById("submit-local").style.display = "none";
    document.getElementById("submit-session").style.display = "none";

    var editButton = document.createElement("button");
    editButton.id = "edit-person";
    editButton.className = "btn btn-success btn-block mb-4";
    editButton.innerText = "Editar";
    editButton.addEventListener("click", function (event) {
        event.preventDefault();
        person.name = document.getElementById("name").value;
        person.lastname = document.getElementById("lastname").value;
        person.mail = document.getElementById("mail").value;

        persons[index] = person;
        
        if (opc) {
            localStorage.setItem("persons", JSON.stringify(persons));
        } else {
            sessionStorage.setItem("persons", JSON.stringify(persons));
        }
        displayPersons();

        // Cerrar el modal
        (bootstrap.Modal.getInstance(document.getElementById('exampleModal'))).hide();
    });

    var cancelButton = document.createElement("button");
    cancelButton.id = "cancel-edit";
    cancelButton.className = "btn btn-primary btn-block mb-4";
    cancelButton.innerText = "Cancelar";
    cancelButton.addEventListener("click", function (event) {
        event.preventDefault();

        (bootstrap.Modal.getInstance(document.getElementById('exampleModal'))).hide();
    });

    var modalFooter = document.createElement("div");
    modalFooter.id = "modal-footer";
    modalFooter.className = "modal-footer";
    modalFooter.appendChild(editButton);
    modalFooter.appendChild(cancelButton);

    document.querySelector("#exampleModal .modal-content").appendChild(modalFooter);

    // Abrir el modal
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
}

function deletePerson(index, opc = false) {

    if (opc) {
        var persons = JSON.parse(localStorage.getItem("persons")) || [];
    } else {
        var persons = JSON.parse(sessionStorage.getItem("persons")) || [];
    }

    persons.splice(index, 1);

    if (opc) {
        localStorage.setItem("persons", JSON.stringify(persons));
    } else {
        sessionStorage.setItem("persons", JSON.stringify(persons));
    }

    displayPersons();
}

// Llamar a la función para mostrar los pacientes al cargar la página
window.onload = function () {
    displayPersons();
};