var User = (function () {

    var urlVista = Sampieri.obtenerUrl() + "usuarios/";    

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
            //Se asigna la funcion userUpdateView cuando se de click al boton con id btnRedirectChangePassword 
            $('#btnRedirectChangePassword').click(function () {
                //Se llama la funcion userUpdateView
                User.userUpdateView();
            });
            //Se asigna al boton con id saveUser la funcion updateUser cuando se le de click
            $('#saveUser').click(function () {
                //Se obtiene el valor del input con id "id_first_name" con un selector
                newName = $('#id_first_name').val();
                //Se obtiene el valor del input con id "id_last_name" con un selector
                newLastName = $('#id_last_name').val();
                //Se obtiene el valor del input con id "id_email" con un selector
                newEmail = $('#id_email').val();
                //Se llama la funcion updateUser y se le pasan como parametros los valores obtenidos de los input
                User.updateUser(newName, newLastName, newEmail);
            })
        },
        //Funcion para mostrar el panel donde se actualizaran los datos
        userUpdateView: function () {
            SimpleAjax.consumir({
            //Propiedades
                type: 'POST',
                url: urlVista + 'userUpdateView/',
                data: {},
                headers: { "X-CSRFToken": csrftoken },
            }).then(function (response) {
                //La respuesta que se obtenga de la llamda al view será pintada en el content con el id "idContentBody"
                $('#ContentBody').html(response);
                //Se asigna una funcion cuando se le de click al boton btnCambiarContrasenia
                $('#btnCambiarContrasenia').click(function () {
                    //Se llama la funcion showFormChangePassword
                    User.showFormChangePassword();
                });
            });
        },
        //Funcion que hace el actualizado el usuario (Usa 3 parametros)
        updateUser: function (newName, newLastName, newEmail) {
            SimpleAjax.consumir({
            //Propiedades
                type: 'POST',
                url: urlVista + 'updateUser/',
                headers: { "X-CSRFToken": csrftoken },
                data: {
                    'newName': newName,
                    'newLastName': newLastName,
                    'newEmail': newEmail,
                },
                success: function (response) {
                    Modal.alert.success("Sus datos se han actualizado con éxito");
                },
                error: function (response) {
                    Modal.alert.error("Error al actualizar sus datos");
                }
            });
        },
        //Funcion para cambiar la contraseña (Usa 2 parametros)
        changePassword: function (newPassword, confirmNewPassword) {
            SimpleAjax.consumir({
            //Propiedades del objeto
                type: 'POST',
                url: urlVista + 'changePassword/',
                headers: { "X-CSRFToken": csrftoken },
                data: {
                    'newPassword': newPassword,
                    'confirmNewPassword': confirmNewPassword,
                },
                success: function (response) {
                    Modal.alert.success(response);
                },
                error: function (response) {
                    Modal.alert.error(response);
                }
            });
        },
        //Funcion para mostrar el modal para cambiar la contraseña 
        showFormChangePassword: function () {
            var modal = Modal.create({
                //id del form que se mostrara dentro del modal
                id: 'formChangePassword',
                //Titulo del modal
                title: 'Cambiar Contraseña'
            });
            User.getFormChangePassword(
                //Encuentra el cuerpo del modal
                modal.find('.modal-body')
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
        //Funcion que muestra mostrar el modal
        getFormChangePassword: function (modalContenedor) {
            //Realizar la llamada ajax para obtener el html de form
            return SimpleAjax.consumir({
                type: 'POST',
                url: urlVista + 'changePasswordUserView/',
                headers: { "X-CSRFToken": csrftoken },
                data: {},
            }).then(function (response) {
                modalContenedor.html(response);
                //Se asigna una funcion al boton con id okModal cuando se le de click
                $('#okModal').click(function () {
                    ////se obtiene el valor de la contraseña nueva por medio de un selector
                    newPassword = $('#id_password').val();
                    //se obtiene el valor de la confirmacion de la contraseña nueva por medio de un selector
                    confirmNewPassword = $('#confirmNewPassword').val();
                    //Se valida que la contraseña sea mayor de 7 caracteres
                    if (newPassword.length > 7) {
                        //Se valida que la contraseña y su confirmacion sean iguales
                        if (newPassword == confirmNewPassword) {
                            //Se ejecuta la funcion
                            User.changePassword(newPassword, confirmNewPassword);
                        }
                        else {
                            //Se muestra este mensajeen caso de quelas contraseñas no coincidan
                            Modal.alert.error("Sus contraseñas deben ser iguales");
                        }
                    }
                    else {
                        //Se muestra este mensaje en caso de que la contraseña tenga menos de 8 caracteres
                        Modal.alert.error("Su contraseña debe llevar al menos 8 carcacteres");
                    }
                });
            });

        },
    }
})();