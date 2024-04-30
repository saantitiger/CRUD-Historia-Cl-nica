window.onload = function () {

    estadoForm(true);

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
            document.getElementById("hasChildrenYes").checked = true;
            toggleChildrenTable();
            var childrenTable = document.getElementById("childrenTableBody");
            for (var i = 0; i < patient.children.length; i++) {
                var child = patient.children[i];
                var row = childrenTable.insertRow(i);
            
                row.innerHTML = `
                    <tr>
                        <td><input type="text" class="form-control" name="childName" required value="${child.name}"></td>
                        <td><input type="number" class="form-control" name="childAge" required value="${child.age}"></td>
                        <td>
                            <button type="button" class="btn btn-danger" onclick="deleteChildrenRow(this)">Eliminar</button>
                        </td>
                    </tr>
                `;
            }
            
        }

        //document.getElementById("city").value = patient.city || "";
    }
};

function deleteChildrenRow(button) {
    var row = button.parentElement.parentElement;
    row.remove();
}

function toggleChildrenTable() {
    var table = document.getElementById("childrenTable");
    if (table.style.display === "none") {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }
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

function regresar() {
    window.location.href = "index.html"
}

function editar() {

    // Ocultar el botón de "Editar"
    document.getElementById("editarButton").style.display = "none";
    // Mostrar los botones de "Guardar" y "Cancelar"
    document.getElementById("guardarButton").style.display = "inline-block";
    document.getElementById("cancelarButton").style.display = "inline-block";

    estadoForm(false);
}

function guardar(){

}

function estadoForm(opcion){

    var formElements = document.getElementById("patient-form").elements;
    // Iterar sobre los elementos y deshabilitarlos
    for (var i = 0; i < formElements.length; i++) {
        formElements[i].disabled = opcion;
    }
}

function cancelar(){
    // Ocultar el botón de "Editar"
    document.getElementById("editarButton").style.display = "inline-block";
    // Mostrar los botones de "Guardar" y "Cancelar"
    document.getElementById("guardarButton").style.display = "none";
    document.getElementById("cancelarButton").style.display = "none";
    
    estadoForm(true);
}