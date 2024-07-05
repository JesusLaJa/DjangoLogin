var Login = (function () {

    var urlVista = Sampieri.obtenerUrl() + "signin/";

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
            //Se asigna una funcion al boton con id btn-iniciar
            $('#btn-iniciar').click(function () {
                //Se obtienen los valores ingresado por el usuario (nombre de usuario) por medio de un selector tomandolos de un input con id id_username
                var username = $('#id_username').val();
                //Se obtienen los valores ingresado por el usuario (la contraseña) por medio de un selector tomandolos de un input con id id_password
                var password = $('#id_password').val();
                //Se valida que la contraseña tenga más de 8 caracteres
                if (password.length > 7) {
                    //Si la contraseña es de al menos 8 caracteres entoncesejecuta la función de iniciar sesión
                    Login.signin(username, password);
                } else {
                    //Se muestra mensaje en vaso de que la contraseña sea menor de 8 caracteres
                    Modal.alert.error("Su contraseña debe llevar al menos 8 carcacteres")
                }
            })
            /*
            BOTON DONDE SE APLICA LA FUNCION PARA REGISTRA (COMENTADA, YA QUE NO SE USA)
            //Se asigna funcion al boton con id btn-registrar al momento que e le de click
            $('#btn-registrar').click(function () {
                //Se obtienen el valor del input con id id_username
                var username = $("#id_username").val();
                //Se obtienen el valor del input con id id_first_name
                var name = $("#id_first_name").val();
                //Se obtienen el valor del input con id id_last_name
                var lastName = $("#id_last_name").val();
                //Se obtienen el valor del input con id id_email
                var email = $("#id_email").val();
                //Se obtienen el valor del input con id id_password
                var password = $("#id_password").val();
                //Se obtienen el valor del input con id confirmacionContrasenia
                var confirmpassword = $("#confirmacionContrasenia").val();
                //Se hace una validación donde la conttraseña tiene que tener más de 8 caracteres
                if (password.length > 7) {
                    //Se hace una validación donde la contraseña tiene que ser igual a la confirmacion de la contraseña
                    if (password == confirmPassword) {
                        //En caso de que se cumplan las dos condiciones se ejecuta la funcion signup y se le pasan sus parametros
                        Login.signup(username, name, lastName, email, password, confirmpassword);
                    } else {
                        //En caso de que no se cumpla la condicion se muestra este mensaje
                        Modal.alert.error("Las contraseñas deben ser iguales");
                    }
                } else {
                    //En caso de que no se cumpla la condicion se muestra este mensaje
                    Modal.alert.error("Su contraseña debe llevar al menos 8 carcacteres");
                }
            })*/
        },
        //Función para iniciar sesión
        signin: function (username, password) {
            $.ajax({
                //Propiedades
                type: 'POST',
                //Obtiene la URL
                url: urlVista,
                data: {
                    'username': username,
                    'password': password
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function (response) {
                    if (response.redirect) {
                        window.location.href = response.redirect;
                    } else if (response.error) {
                        Modal.alert.error("Error: " + response.error);
                    }
                },
                error: function (response) {
                    Modal.alert.error("Error al iniciar sesión. Por favor, intente de nuevo.");
                }
            });
        },
        /*
        //FUNCION PARA REALIZAR REGISTRO (COMENTADA, YA QUE NO SE USA)
        signup: function (username, name, lastName, email, password, confirmpassword) {
            $.ajax({
                //PROPIEDADES DEL OBJETO
                //se usa un POST
                type: 'POST',
                url: 'http://127.0.0.1:8000/signup/',
                data: {
                    //porpiedades de data(son los parametros)
                    'username': username,
                    'name': name,
                    'lastName': lastName,
                    'email': email,
                    'password': password,
                    'confirmPassword': confirmpassword
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                //En caso de que sea exitosa la funcion devolvera la respuesta por medio de un alert
                success: function (response) {
                    Modal.alert.success(response);
                }
            });
        }*/
    }
})();