var Proveedor = (function () {

    var urlVista = Sampieri.obtenerUrl() + "proveedor/";

    function getCookie(name) {
        /*se asigna un valor nulo a la cookie */
        let cookieValue = null;
        /*se verifica que document.cookie no este vacio*/
        if (document.cookie && document.cookie !== '') {
            /*si no está vacío se ejecuta*/
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // si la cookie coincide con el nombre de la cookie que se esta buscanod se sustrae
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    /*se asigna ese valor a cookieValue*/
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    return {
        init: function () {
            Proveedor.listProveedoresView();
        },
        //FUNCION PARA MOSTRAR EL LISTADO DE PROVEEDORES
        listProveedoresView: function () {
            SimpleAjax.consumir({
                //Propiedades
                type: 'POST',
                url: urlVista + 'proveedoresTablaView/',
                data: {},
                headers: { "X-CSRFToken": csrftoken },
            }).then(function (response) {
                //Se indica donde se pintara el html(la tabla) que devuelva
                $("#divTablaProveedores").html(response);

                //Se asigna una fiuncion cuando se le de click a los elementos html que tengan la clase btnUpdateProveedores
                $('.btnUpdateProveedores').click(function () {
                    //Se obtiene el valor del data-id del elemento al que se le dio click
                    idProveedor = $(this).data('id');
                    //Se llama la funcion que muestra el modal para actualizar el proveedor y se le pasa un parametro(el id)
                    Proveedor.showModalUpdateProveedor(idProveedor);
                });
                //Se da formato a la tabla
                $("#proveedoresTable").DataTable({
                    pageLength: 25,
                    responsive: true,
                    searching: false,
                    language: {
                        "sProcessing": "Procesando...",
                        "sLengthMenu": "Mostrar _MENU_ registros",
                        "sZeroRecords": "No se encontraron resultados",
                        "sEmptyTable": "Ningún dato disponible en esta tabla",
                        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                        "sInfoPostFix": "",
                        "sSearch": "Buscar:",
                        "sUrl": "",
                        "sInfoThousands": ",",
                        "sLoadingRecords": "Cargando...",
                        "oPaginate": {
                            "sFirst": "Primero",
                            "sLast": "Último",
                            "sNext": "Siguiente",
                            "sPrevious": "Anterior"
                        },
                        "oAria": {
                            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                        },
                        "buttons": {
                            "copyTitle": 'Copiar al portapapeles',
                            "copySuccess": {
                                "_": '%d filas copiadas',
                                "1": '1 fila copiada'
                            },
                            "pageLength": {
                                "_": "Mostrar %d filas",
                                "-1": "Mostrar Todo"
                            }
                        }
                    }
                });
            });
        },
        //FUNCION PARA MOSTRAR EL MODAL DE ACTUALIZAR PROVEEDOR
        showModalUpdateProveedor: function (idProveedor) {
            //Se usa el metodo para crear modal y se asigna a una variable
            var modal = Modal.create({
                //id del form que se mostrara dentro del modal
                id: 'formUpdateProveedor',
                //Titulo del modal
                title: 'Proveedor'
            });
            //Se llama al metodo/funcionn que obtiene el formulario para actualizar
            Proveedor.getFormUpdateProveedor(
                //Encuentra el cuerpo del modal
                modal.find('.modal-body'),
                //se pasan los parametros requeridos por la funcion
                idProveedor
            ).then(function () {
                modal.modal('show').on('shown.bs.modal', function () {
                    modal.find('input,select,textarea').jqBootstrapValidation();
                    modal.find('[id="okModal"]').unbind('click').bind('click', function () {
                        if (modal.find('input,select,textarea').jqBootstrapValidation('hasErrors')) {
                            modal.find('[type="submit"]').trigger('click');
                            return false;
                        }
                        Modal.close(modal.attr('id'));
                    });
                });
            });
        },
        //FUNCION QUE OBTIENE EL FORM PARA ACTUALIZAR LOS PROVEEDORES
        getFormUpdateProveedor: function (modalContenedor, idProveedor) {
            //Realizar la llamada ajax para obtener el html de form
            return SimpleAjax.consumir({
                type: 'POST',
                url: urlVista + 'proveedorUpdateView/',
                headers: { "X-CSRFToken": csrftoken },
                data: {
                    'idProveedor': idProveedor
                },
            }).then(function (response) {
                modalContenedor.html(response);
                //Se asigna una funcion al boton con id okModal cuando se le de click
                $('#okModal').click(function () {
                    //Se obtienen los valores ingresados por el usuario y se asignan a las variables
                    newNombre = $('#id_nombre').val();
                    newTelefono = $('#id_telefono').val();
                    newEmail = $('#id_email').val();
                    newDireccion = $('#id_direccion').val();
                    newCodigoPostal = $('#id_codigoPostal').val();
                    //Se llama a la funcion que actualiza los proveedores y se pasan los parametros que necesita
                    Proveedor.updateProveedores(idProveedor, newNombre, newTelefono, newEmail, newDireccion, newCodigoPostal)
                });
            });
        },
        //FUNCION PARA ACTUALIZAR PROVEEDORES
        updateProveedores: function (idProveedor, newNombre, newTelefono, newEmail, newDireccion, newCodigoPostal) {
            SimpleAjax.consumir({
                //Propiedades
                type: 'POST',
                url: urlVista + 'updateProveedor/',
                data: {
                    'idProveedor': idProveedor,
                    'newNombre': newNombre,
                    'newTelefono': newTelefono,
                    'newEmail': newEmail,
                    'newDireccion': newDireccion,
                    'newCodigoPostal': newCodigoPostal
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function (response) {
                    Modal.alert.success(response);
                    //Se refresca la URL
                    $('.swal2-confirm').click(function () {
                        location.reload();
                    });
                },
                error: function (response) {
                    Modal.alert.error(response);
                }
            });
        },
    }
})();