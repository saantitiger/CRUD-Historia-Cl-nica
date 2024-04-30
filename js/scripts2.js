window.onload = function () {
    showActual()
};

function showActual() {

    window.refres

    // Obtener el índice de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var index = parseInt(urlParams.get("index"));

    // Recuperar datos de localStorage
    var patients = JSON.parse(localStorage.getItem("patients")) || [];

    var patient = patients[index];
    if (patient) {
        document.getElementById("idNumber").value = patient.idNumber || "";
        document.getElementById("name").value = patient.name || "";
        document.getElementById("address").value = patient.address || "";
        document.getElementById("phone").value = patient.phone || "";
        document.getElementById("birthdate").value = patient.birthdate || "";
        document.getElementById("country").value = patient.country || "";
        document.getElementById("photo-preview").src = patient.photo;

        if (patient.children && patient.children.length > 0) {
            document.getElementById("hasChildrenYes").click();
            toggleChildrenTable();
            var childrenTable = document.getElementById("childrenTableBody");
            for (var i = 0; i < patient.children.length; i++) {
                var child = patient.children[i];
                var row = childrenTable.insertRow(i);

                row.innerHTML = `
                    <tr>
                        <td><input type="text" class="form-control" name="childName" disabled=true required value="${child.name}"></td>
                        <td><input type="number" class="form-control" name="childAge" disabled=true required value="${child.age}"></td>
                        <td>
                            <button type="button" class="btn btn-danger" disabled=true onclick="deleteChildrenRow(this)">Eliminar</button>
                        </td>
                    </tr>
                `;
            }

        } else {
            document.getElementById("hasChildrenNo").click();
        }

        if (patient.appointments && patient.appointments.length > 0) {
            document.getElementById("hasAppointmentYes").click();
            toggleAppointmentTable();
            var appointmentTable = document.getElementById("appointmentTableBody");
            for (var i = 0; i < patient.appointments.length; i++) {
                var appointment = patient.appointments[i];
                var row = appointmentTable.insertRow(i);
                row.innerHTML = `
                    <tr>
                        <td><input type="datetime-local" class="form-control" name="appointmentDate" disabled=true required value="${appointment.date}"></td>
                        <td><input type="text" class="form-control" name="appointmentReason" disabled=true required value="${appointment.area}"></td>
                        <td>
                            <button type="button" class="btn btn-danger" disabled=true onclick="deleteAppointmentRow(this)">Eliminar</button>
                        </td>
                    </tr>
                `;
            }
        } else {
            document.getElementById("hasAppointmentNo").click();
        }

        //document.getElementById("city").value = patient.city || "";

        estadoForm(true);
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

function toggleChildrenTable() {
    var table = document.getElementById("childrenTable");
    table.style.display = "block";
}

function toggleChildrenTable2() {
    var table = document.getElementById("childrenTable");
    table.style.display = "none";
}

function toggleAppointmentTable() {
    var table = document.getElementById("appointmentTable");
    table.style.display = "block";
}

function toggleAppointmentTable2() {
    var table = document.getElementById("appointmentTable");
    table.style.display = "none"
}

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

function back() {
    window.location.href = "index.html"
}

function edit() {

    // Ocultar el botón de "Editar"
    document.getElementById("editarButton").style.display = "none";
    // Mostrar los botones de "Guardar" y "Cancelar"
    document.getElementById("guardarButton").style.display = "inline-block";
    document.getElementById("cancelarButton").style.display = "inline-block";

    estadoForm(false);
}

function save() {
    var urlParams = new URLSearchParams(window.location.search);
    var index = parseInt(urlParams.get("index"));
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

    var patients = JSON.parse(localStorage.getItem("patients")) || [];
    if (index >= 0 && index < patients.length) {
        var patient = patients[index];

        // Obtener la imagen seleccionada solo si se ha seleccionado una nueva imagen
        var newPhoto = null;
        var photo = document.getElementById("photo");
        if (photo.files && photo.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                newPhoto = e.target.result;

                // Actualizar los datos del paciente
                patient.idNumber = idNumber;
                patient.name = name;
                patient.address = address;
                patient.phone = phone;
                patient.birthdate = birthdate;
                patient.country = country;
                patient.city = city;
                patient.children = children;
                patient.appointments = appointments;

                // Guardar la nueva imagen solo si se ha seleccionado una nueva imagen
                if (newPhoto) {
                    patient.photo = newPhoto;
                }

                // Guardar el paciente modificado en el array
                patients[index] = patient;
                localStorage.setItem("patients", JSON.stringify(patients));
            };
            reader.readAsDataURL(photo.files[0]);
        } else {
            // Si no hay una nueva imagen seleccionada, solo actualizar los datos del paciente
            patient.idNumber = idNumber;
            patient.name = name;
            patient.address = address;
            patient.phone = phone;
            patient.birthdate = birthdate;
            patient.country = country;
            patient.city = city;
            patient.children = children;
            patient.appointments = appointments;

            // Guardar el paciente modificado en el array
            patients[index] = patient;
            localStorage.setItem("patients", JSON.stringify(patients));
        }
    }

    var table = document.getElementById("childrenTableBody");
    table.innerHTML = "";

    var table = document.getElementById("appointmentTableBody");
    table.innerHTML = "";

    // Recargar la página después de 1 segundo
    setTimeout(() => {
        location.reload();
    }, 0.1);

    showActual()

    // Mostrar el botón de "Editar"
    document.getElementById("editarButton").style.display = "inline-block";
    // Ocultar los botones de "Guardar" y "Cancelar"
    document.getElementById("guardarButton").style.display = "none";
    document.getElementById("cancelarButton").style.display = "none";

};

function estadoForm(opcion) {

    var formElements = document.getElementById("patient-form").elements;
    // Iterar sobre los elementos y deshabilitarlos
    for (var i = 0; i < formElements.length; i++) {
        formElements[i].disabled = opcion;
    }
}

function cancel() {
    // Mostrar el botón de "Editar"
    document.getElementById("editarButton").style.display = "inline-block";
    // Ocultar los botones de "Guardar" y "Cancelar"
    document.getElementById("guardarButton").style.display = "none";
    document.getElementById("cancelarButton").style.display = "none";

    var childrenTable = document.getElementById("childrenTableBody");
    childrenTable.innerHTML = ""

    var appointmentTable = document.getElementById("appointmentTableBody");
    appointmentTable.innerHTML = ""

    showActual()
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