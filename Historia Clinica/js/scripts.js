// Llamar a la función para mostrar los pacientes al cargar la página
window.onload = function () {
    displayPatients();
};

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

    // Validar la cédula de identidad
    if (!validateCi(idNumber)) {
        document.getElementById("idNumberError").style.display = "inline";
        document.getElementById("idNumber").focus();
        return;
    } else {
        document.getElementById("idNumberError").style.display = "none";
    }

    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var birthdate = document.getElementById("birthdate").value;
    var country = document.getElementById("country").value;
    var city = document.getElementById("city").value;

    var childrenTable = document.getElementById("childrenTableBody");
    var children = [];
    if (document.getElementById("hasChildrenYes").checked) {
        for (var i = 0; i < childrenTable.rows.length; i++) {
            var childName = childrenTable.rows[i].cells[0].querySelector("input").value;
            var childAge = childrenTable.rows[i].cells[1].querySelector("input").value;
            children.push({ name: childName, age: childAge });
        }
    }
    var appointmentTable = document.getElementById("appointmentTableBody");
    var appointments = [];

    if (document.getElementById("hasAppointmentYes").checked) {
        for (var i = 0; i < appointmentTable.rows.length; i++) {
            var appointmentDate = appointmentTable.rows[i].cells[0].querySelector("input").value;
            var appointmentArea = appointmentTable.rows[i].cells[1].querySelector("input").value;
            appointments.push({ date: appointmentDate, area: appointmentArea });
        }
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
            appointments: appointments
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

        var table = document.getElementById("appointmentTableBody");
        table.innerHTML = "";
        var table2 = document.getElementById("appointmentTable");
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
        var edad = calculateAge(patient.birthdate); // Calcular edad
        var row = tableBody.insertRow();
        row.innerHTML = `
            <td><img src="${patient.photo}" width="50" height="50"></td>
            <td>${patient.idNumber}</td>
            <td>${patient.name}</td>
            <td>${patient.address}</td>
            <td>${patient.phone}</td>
            <td>${patient.birthdate}</td>
            <td>${edad.años} años, ${edad.meses} meses, ${edad.dias} días, ${edad.horas} horas</td>
            <td>${patient.country}</td>
            <td>${patient.city}</td>
            
            <td>${patient.children.length > 0 ? patient.children.length : 0}</td>
            <td>${patient.appointments.length > 0 ? patient.appointments.length : 0}</td>
            <td>
                <button type="button" class="btn btn-primary" onclick="getPatient(${index})">Ver</button>
                <button type="button" class="btn btn-danger" onclick="deletePatient(${index})">Eliminar</button>
            </td>
        `;
    });
}

function calculateAge(fechaNacimiento) {
    var fechaNacimiento = new Date(fechaNacimiento);
    var fechaActual = new Date();

    var edad = {
        años: 0,
        meses: 0,
        dias: 0,
        horas: 0
    };

    // Calcular años
    edad.años = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    // Calcular meses
    var meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
    if (meses < 0 || (meses === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad.años--;
        meses += 12;
    }
    edad.meses = meses;

    // Calcular días
    var dias = fechaActual.getDate() - fechaNacimiento.getDate();
    if (dias < 0) {
        var ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0).getDate();
        dias += ultimoDiaMes;
        edad.meses--;
    }
    edad.dias = dias;

    // Calcular horas
    var horas = fechaActual.getHours() - fechaNacimiento.getHours();
    if (horas < 0) {
        edad.dias--;
        horas += 24;
    }
    edad.horas = horas;

    return edad;
}

function getPatient(index) {
    // Lógica para mostrar los detalles del paciente
    window.location.href = "edit.html?index=" + index;
}

function deletePatient(index) {
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

function toggleAppointmentTable() {
    var table = document.getElementById("appointmentTable");
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

function addAppointmentRow() {
    var table = document.getElementById("appointmentTableBody");
    var row = table.insertRow();
    row.innerHTML = `
    <tr>
        <td><input type="datetime-local" class="form-control" name="appointmentDate" required></td>
        <td><input type="text" class="form-control" name="appointmentReason" required></td>
        <td>
            <button type="button" class="btn btn-danger" onclick="deleteAppointmentRow(this)">Eliminar</button>
        </td>
    </tr>
    `;
}

function deleteChildrenRow(button) {
    var row = button.parentElement.parentElement;
    row.remove();
}

function deleteAppointmentRow(button) {
    var row = button.parentElement.parentElement;
    row.remove();
}

function validateCi(ci) {
    var isNumeric = true;
    var total = 0,
        individual;

    for (var position = 0; position < 10; position++) {
        // Obtiene cada posición del número de cédula
        // Se convierte a string en caso de que 'ci' sea un valor numérico
        individual = ci.toString().substring(position, position + 1)

        if (isNaN(individual)) {
            isNumeric = false;
            break;
        } else {
            // Si la posición es menor a 9
            if (position < 9) {
                // Si la posición es par, osea 0, 2, 4, 6, 8.
                if (position % 2 == 0) {
                    // Si el número individual de la cédula es mayor a 5
                    if (parseInt(individual) * 2 > 9) {
                        // Se duplica el valor, se obtiene la parte decimal y se aumenta uno 
                        // y se lo suma al total
                        total += 1 + ((parseInt(individual) * 2) % 10);
                    } else {
                        // Si el número individual de la cédula es menor que 5 solo se lo duplica
                        // y se lo suma al total
                        total += parseInt(individual) * 2;
                    }
                    // Si la posición es impar (1, 3, 5, 7)
                } else {
                    // Se suma el número individual de la cédula al total
                    total += parseInt(individual);
                }
            }
        }
    }

    if ((total % 10) != 0) {
        total = (total - (total % 10) + 10) - total;
    } else {
        total = 0;
    }


    if (isNumeric) {
        // El total debe ser igual al último número de la cédula
        // La cédula debe contener al menos 10 dígitos
        if (ci.toString().length != 10) {
            return false;
        }

        // El número de cédula no debe ser cero
        if (parseInt(ci, 10) == 0) {
            return false;
        }

        // El total debe ser igual al último número de la cédula
        if (total != parseInt(individual)) {
            return false;
        }

        return true;
    }

    // Si no es un número  
    return false;
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
