window.onload = function () {
    BuscarClientes();
};


$("#EstadoID").change(function () {
    BuscarClientes();
});


function BuscarClientes(textoBusqueda) {

    let estadoID = $("#EstadoID").val();

    $("#tbody-clientes").empty();

    $.ajax({
        type: "POST",
        url: '../../Clientes/BuscarClientes',
        data: { buscar: textoBusqueda, EstadoID: estadoID },
        success: function (listadoclientes) {

            $("#tbody-clientes").empty();

            if (listadoclientes.mensaje) {

                $("#tbody-clientes").append('<tr><td colspan="7" class="text-center">' + listadoclientes.mensaje + '</td></tr>');

            } else {

                $.each(listadoclientes, function (index, cliente) {

                    let clasetabla = 'table-success';

                    let botones = '<button type="button" title="Editar" onclick="BuscarCliente(' + cliente.clienteID + ')" class="btn btn-warning" style="margin-right: 5px;" ><i class="fa-regular fa-pen-to-square"></i></button>'
                        + '<button type="button" title="Inactivar" onclick="confirmarInactivar(' + cliente.clienteID + ')"class="btn btn-danger"><i class="fa-solid fa-ban"></i></button>';

                    let botonAtributos = '<a type="button" title="Atributos adicionales" class="btn btn-info" onclick="BuscarAtributos(' + cliente.clienteID + ')"><i class="fa-solid fa-circle-info"></i></a>';


                    if (cliente.estado == 2) {

                        clasetabla = 'table-danger';

                        botones = '<button type="button" title="Activar cliente" onclick="confirmarActivar(' + cliente.clienteID + ')" class="btn btn-success"  style="margin-right: 5px;"><i class="fas fa-check"></i></button>'
                            + '<button type="button" title="Eliminar cliente" onclick="EliminarCliente(' + cliente.clienteID + ')"class="btn btn-danger" ><i class="fa-regular fa-trash-can"></i></button>';
                    }


                    $("#tbody-clientes").append('<tr class=' + clasetabla + '>' +
                        '<td>' + cliente.nombreCompleto + '</td>' +
                        '<td class="text-center"><b>' + mostrarDNI(cliente.dni) + '</b></td>' +
                        '<td class="text-center">' + cliente.edad + '</td>' +
                        '<td class="text-center">' + cliente.generoNombre + '</td>' +
                        '<td class="text-center">' + cliente.estadoNombre + '</td>' +
                        '<td class="text-center">' + botonAtributos + '</td>' +
                        '<td class="text-center">' + botones + '</td>' +
                        '</tr>');
                });

            }
        },
        error: function (data) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al buscar los clientes.",
                text: "Por favor, intenta de nuevo."
            });
        }
    });


}



function BuscarAtributos(clienteID) {

    VaciarModalAtributos();

    $.ajax({
        type: "POST",
        url: '../../Clientes/BuscarClientes',
        data: { ClienteID: clienteID },
        success: function (listadoclientes) {

            if (listadoclientes.length == 1) {
                let cliente = listadoclientes[0];

                $("#tituloModalAtributo").text("ATRIBUTOS ADICIONALES DE " + cliente.nombreCompleto);


                var textoconducir = "NO"; 

                if (cliente.maneja == true) {
                    var textoconducir = "SI"; 
                }

                $("#MA-Conduce").text(textoconducir);



                var textoFuma = "NO";

                if (cliente.fuma == true) {
                    var textoFuma = "SI";
                }

                $("#MA-Fuma").text(textoFuma);



                var textoLentes = "NO";

                if (cliente.usaLentes == true) {
                    var textoLentes = "SI";
                }

                $("#MA-Lentes").text(textoLentes);



                var textoDiabete = "NO";

                if (cliente.diabetes == true) {
                    var textoDiabete = "SI";
                }


                $("#MA-Diabete").text(textoDiabete);



                var textoEnf = "NO";

                if (cliente.enfermedad == true) {
                    var textoEnf = "SI";
                }
      

                $("#MA-Enfermedad").text(textoEnf);


                var descEnfermedad = cliente.tipoEnfermedad;

                if (cliente.tipoEnfermedad == null) {
                    descEnfermedad = "-";
                }

                $("#MA-TipoEnfermedad").text(descEnfermedad);

                $("#modalAtributos").modal("show");


            }
        },
        error: function (data) {

            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al buscar al cliente.",
                text: "Por favor, intenta de nuevo."
            });
        }
    });

}


function VaciarModalAtributos() {

    $("#tituloModalAtributo").val('');

    $("#MA-Conduce").val('');

    $("#MA-Fuma").val('');

    $("#MA-Lentes").val('');

    $("#MA-Diabete").val('');

    $("#MA-Enfermedad").val('');

    $("#MA-TipoEnfermedad").val('');

}


function AbrirModal() {
    $("#tituloModal").text("REGISTRAR UN NUEVO CLIENTE.");

    $("#ClienteID").val(0);

    $("#Nombre").val('');

    $("#dni").val('');

    $("#Edad").val('');

    $("#Genero").val(0);

    document.getElementById('Estado').disabled = false;


    $("#Estado").val(0);

    $("#Maneja").prop('checked', false);

    $("#Fuma").prop('checked', false);

    $("#UsaLentes").prop('checked', false);

    $("#Diabetes").prop('checked', false);

    $("#Enfermedad").prop('checked', false);


    document.getElementById('DescripcionEnfermerdad').disabled = true;

    $("#DescripcionEnfermerdad").val('');

    $("#ErrorCliente").text('');

    $("#modal").modal("show");
}



function VaciarModal() {

    $("#ClienteID").val(0);

    $("#Nombre").val('');

    $("#dni").val('');

    $("#Edad").val('');

    $("#Genero").val(0);

    $("#Estado").val(0);

    $("#DescripcionEnfermerdad").val('');

    $("#ErrorCliente").text('');

}


//------------------- FUNCION PARA GUARDAR EL CLIENTE --------------------------------

function GuardarCliente() {

    var clienteID = $("#ClienteID").val();

    var nombre = $("#Nombre").val();

    var dni = removerPuntos(document.getElementById("dni"));

    var edad = $("#Edad").val();

    var genero = $("#Genero").val();

    var estado = $("#Estado").val();

    var maneja = document.getElementById('Maneja').checked;

    var fuma = document.getElementById('Fuma').checked;

    var usalentes = document.getElementById('UsaLentes').checked;

    var diabetes = document.getElementById('Diabetes').checked;

    var enfermedad = document.getElementById('Enfermedad').checked;

    var tipoenfermedad = $("#DescripcionEnfermerdad").val();

    $("#ErrorCliente").text('');

    let guardar = true;

    let mensajesError = [];

    console.log(dni);


    if (nombre == "" || nombre == null) {
        mensajesError.push("Tienes que ingresar el nombre del cliente.");
        guardar = false;
    }


    if (dni == "" || dni == null) {
        mensajesError.push("Tienes que ingresar el DNI del cliente.");
        guardar = false;
    }


    if (isNaN(edad) || edad <= 0 || edad > 160) {
        mensajesError.push("Tienes que ingresar una edad válida para el cliente.");
        guardar = false;
    }


    if (genero == 0) {
        mensajesError.push("Tienes que seleccionar el género del cliente.");
        guardar = false;
    }

    if (estado == 0) {
        mensajesError.push("Tienes que seleccionar el estado del cliente.");
        guardar = false;
    }



    if (enfermedad && (tipoenfermedad == "" || tipoenfermedad == null)) {
        mensajesError.push("Tienes que ingresar la enfermedad que posee el cliente.");
        guardar = false;
    }


    if (!guardar) {
        $("#ErrorCliente").text(mensajesError.join(" "));
        return;
    }


    if (guardar) {

        if (enfermedad === false) {
            tipoenfermedad = '';
        }
        
        $.ajax({
            type: "POST",
            url: '../../Clientes/GuardarCliente',
            data: { ClienteID: clienteID, NombreCompleto: nombre, DNI: dni, Edad: edad, Genero: genero, Estado: estado, Maneja: maneja, Fuma: fuma, UsaLentes: usalentes, Diabetes: diabetes, Enfermedad: enfermedad, TipoEnfermedad: tipoenfermedad },
            success: function (resultado) {
                if (resultado === 0) {
                    Swal.fire({
                        icon: "success",
                        title: "Se registró el cliente correctamente."
                    }).then(() => {
                        BuscarClientes();
                        $("#modal").modal("hide");
                    });
                }
                if (resultado === 1) {
                    Swal.fire({
                        icon: "error",
                        title: "Ya existe un cliente con ese numero de DNI.",
                        text: "Verifique cuidadosamente la información ingresada."
                    });
                }

            },
            error: function (data) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error al guardar el cliente.",
                    text: "Por favor, intenta de nuevo."
                });
            }
        });
    }
}

//------------------- FUNCION PARA BUSCAR EL CLIENTE PARA EDITAR --------------------------------

function BuscarCliente(clienteID) {

    VaciarModal();

    $.ajax({
        type: "POST",
        url: '../../Clientes/BuscarClientes',
        data: { ClienteID: clienteID },
        success: function (listadoclientes) {

            if (listadoclientes.length == 1) {
                let cliente = listadoclientes[0];

                $("#tituloModal").text("EDITAR LOS DATOS DE " + cliente.nombreCompleto);

                $("#ClienteID").val(cliente.clienteID);

                $("#Nombre").val(cliente.nombreCompleto);

                $("#dni").val(mostrarDNI(cliente.dni));

                $("#Edad").val(cliente.edad);

                $("#Genero").val(cliente.genero);

                document.getElementById('Estado').disabled = true;

                $("#Estado").val(cliente.estado); 

                $("#Maneja").prop('checked', cliente.maneja === true);

                $("#Fuma").prop('checked', cliente.fuma === true);

                $("#UsaLentes").prop('checked', cliente.usaLentes === true);

                $("#Dibetes").prop('checked', cliente.diabetes === true);

                $("#Enfermedad").prop('checked', cliente.enfermedad === true);

                if (cliente.enfermedad === true) {

                    document.getElementById('DescripcionEnfermerdad').disabled = false;

                } else {

                    document.getElementById('DescripcionEnfermerdad').disabled = true;
                }

                $("#DescripcionEnfermerdad").val(cliente.tipoEnfermedad);
               
                $("#modal").modal("show");


            }
        },
        error: function (data) {

            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al buscar al cliente.",
                text: "Por favor, intenta de nuevo."
            });
        }
    });
}


//------------------- FUNCIONES PARA MODIFICAR EL ESTADO DEL CLIENTE --------------------------------


function confirmarInactivar(clienteID) {
    Swal.fire({
        title: 'Mensaje de confirmación',
        text: '¿Estás seguro de inactivar el cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            EstadoDelCliente(clienteID);
        }
    });
}

function confirmarActivar(clienteID) {
    Swal.fire({
        title: 'Mensaje de confirmación',
        text: '¿Estás seguro de activar nuevamente el cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            EstadoDelCliente(clienteID);
        }
    });
}


function EstadoDelCliente(clienteID) {

    $.ajax({
        url: '../../Clientes/EstadoDelCliente',

        data: { ClienteID: clienteID },

        type: 'POST',

        dataType: 'json',

        success: function (resultado) {

            if (resultado) {
                Swal.fire({
                    icon: "success",
                    title: "El estado del cliente fue modificado correctamente."
                }).then(() => {
                    BuscarClientes();
                });
            }

        },

        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al modificar el estado del cliente.",
                text: "Por favor, intenta de nuevo."
            });
        },
    });
}


//-------------------FUNCION PARA ELIMINAR EL CLIENTE --------------------------------

function EliminarCliente(clienteID) {
    Swal.fire({
        title: "¿Está seguro que quiere eliminar el cliente?",
        icon: "warning",
        text: "Se van a perder todos los datos del cliente.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: '../../Clientes/EliminarCliente',
                data: { ClienteID: clienteID },
                success: function (cliente) {

                    if (cliente.resultado) {
                        Swal.fire({
                            icon: 'success',
                            title: cliente.mensaje
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: cliente.mensaje
                        });
                    }

                    BuscarClientes();
                },
                error: function (data) {

                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error al eliminar el cliente.",
                        text: "Por favor, intenta de nuevo."
                    });
                }
            });
        }
    });
}




//-------------------FUNCIONES DE INDEX PARA LOS INPUTS--------------------------------

function formatearDNI(input) {

    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 6) {
        valor = valor.slice(0, valor.length - 6) + '.' + valor.slice(valor.length - 6, valor.length - 3) + '.' + valor.slice(valor.length - 3);
    } else if (valor.length > 3) {
        valor = valor.slice(0, valor.length - 3) + '.' + valor.slice(valor.length - 3);
    }

    input.value = valor;
}


function habilitarEnfermedad() {
    var checkbox = document.getElementById('Enfermedad');
    var input = document.getElementById('DescripcionEnfermerdad');

    if (checkbox.checked) {
        input.disabled = false;
    } else {
        input.disabled = true;
    }
}


function limitarEdad(input) {
    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3); 
    }
}


function removerPuntos(input) {
    return input.value.replace(/\./g, '');
}


function mostrarDNI(dni) {
    let valor = dni.toString().replace(/\D/g, ''); 

    if (valor.length > 6) {
        valor = valor.slice(0, valor.length - 6) + '.' + valor.slice(valor.length - 6, valor.length - 3) + '.' + valor.slice(valor.length - 3);
    } else if (valor.length > 3) {
        valor = valor.slice(0, valor.length - 3) + '.' + valor.slice(valor.length - 3);
    }

    return valor;
}
