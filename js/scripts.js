document.getElementById("country").addEventListener("change", function () {
    var country = this.value;
    var citySelect = document.getElementById("city");
    citySelect.innerHTML = "";
    if (country === "Ecuador") {
        addOption(citySelect, "Quito");
        addOption(citySelect, "Guayaquil");
        addOption(citySelect, "Cuenca");
    } else if (country === "Colombia") {
        addOption(citySelect, "Bogotá");
        addOption(citySelect, "Medellín");
    } else if (country === "Perú") {
        addOption(citySelect, "Lima");
        addOption(citySelect, "Arequipa");
    }
});

function addOption(select, value) {
    var option = document.createElement("option");
    option.text = value;
    option.value = value;
    select.add(option);
}

function previewPhoto(event) {
    var input = event.target;
    var preview = document.getElementById('photo-preview');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}


document.getElementById("patient-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var idNumber = document.getElementById("idNumber").value;
    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var birthdate = document.getElementById("birthdate").value;
    var country = document.getElementById("country").value;
    var city = document.getElementById("city").value;

    var childrenTable = document.getElementById("childrenTableBody");
    var children = [];

    for (var i = 0; i < childrenTable.rows.length; i++) {
        var childName = childrenTable.rows[i].cells[0].querySelector("input").value;
        var childAge = childrenTable.rows[i].cells[1].querySelector("input").value;
        children.push({ name: childName, age: childAge });
    }

    // Obtener la imagen seleccionada
    var photo = document.getElementById("photo");
    if (!photo.files || !photo.files[0]) {
        alert("Por favor, seleccione una imagen.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
        var photoData = e.target.result;
        // Crear objeto paciente con la imagen
        var patient = {
            idNumber: idNumber,
            name: name,
            address: address,
            phone: phone,
            birthdate: birthdate,
            country: country,
            city: city,
            photo: photoData, // Guardar la imagen como base64
            children: children,
            appointments: []
        };

        var patients = JSON.parse(localStorage.getItem("patients")) || [];
        patients.push(patient);
        localStorage.setItem("patients", JSON.stringify(patients));

        displayPatients();
        document.getElementById("photo-preview").src = "./img/user.png"; // Limpiar la previsualización de la imagen
        document.getElementById("patient-form").reset(); // Reiniciar el formulario

        var table = document.getElementById("childrenTableBody");
        table.innerHTML = "";
        var table2 = document.getElementById("childrenTable");
        table2.style.display = "none"


        var citySelect = document.getElementById("city");
        citySelect.innerHTML = "";

    };
    reader.readAsDataURL(photo.files[0]);
});


function displayPatients() {

    var patients = JSON.parse(localStorage.getItem("patients")) || [];
    var tableBody = document.querySelector("#patients-list tbody");
    tableBody.innerHTML = "";
    patients.forEach(function (patient, index) {
        var row = tableBody.insertRow();
        row.innerHTML = `
            <td><img src="${patient.photo}" width="50" height="50"></td>
            <td>${patient.idNumber}</td>
            <td>${patient.name}</td>
            <td>${patient.address}</td>
            <td>${patient.phone}</td>
            <td>${patient.birthdate}</td>
            <td>${patient.country}</td>
            <td>${patient.city}</td>
            
            <td>${patient.children.length > 0 ? patient.children.length : 0}</td>

            <td>
                <button type="button" class="btn btn-primary" onclick="verPaciente(${index})">Ver</button>
                <button type="button" class="btn btn-danger" onclick="eliminarPaciente(${index})">Eliminar</button>
            </td>
        `;
    });
}

function verPaciente(index) {
    // Lógica para mostrar los detalles del paciente
    window.location.href = "edit.html?index=" + index;
}


function eliminarPaciente(index) {
    var patients = JSON.parse(localStorage.getItem("patients")) || [];
    patients.splice(index, 1);
    localStorage.setItem("patients", JSON.stringify(patients));
    displayPatients();
    // Lógica para eliminar al paciente de la lista
}

function toggleChildrenTable() {
    var table = document.getElementById("childrenTable");
    if (table.style.display === "none") {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }
}

function addChildrenRow() {
    var table = document.getElementById("childrenTableBody");
    var row = table.insertRow();
    row.innerHTML = `
    <tr>
        <td><input type="text" class="form-control" name="childName" required></td>
        <td><input type="number" class="form-control" name="childAge" required></td>
        <td>
            <button type="button" class="btn btn-danger" onclick="deleteChildrenRow(this)">Eliminar</button>
        </td>
    </tr>
    `;
}


function deleteChildrenRow(button) {
    var row = button.parentElement.parentElement;
    row.remove();
}

// Función para restringir la entrada de caracteres en los campos de entrada
function restrictInput(event) {
    // Permitir únicamente números y teclas de navegación
    if (!(event.key === "Backspace" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Delete" || (event.key >= "0" && event.key <= "9"))) {
        event.preventDefault();
    }
}
// Aplicar la función al campo de cédula de identidad
document.getElementById("idNumber").addEventListener("keydown", restrictInput);
// Aplicar la función al campo de número de teléfono
document.getElementById("phone").addEventListener("keydown", restrictInput);

displayPatients();