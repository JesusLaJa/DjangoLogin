import json
import openpyxl
from .models import proveedores
from .forms import userForm, proveedoresForm
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
#VISTA DEL HOME
@login_required
def home(request):
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Sampieri
    sampieri = request.user.groups.filter(name='Sampieri').exists()
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Proveedor
    proveedor = request.user.groups.filter(name='Proveedor').exists()
    return render(request, "menu.html", {
        #Diccionario de datos
        'sampieri': sampieri,
        'proveedor': proveedor,
    })
#METODO PARA CERRAR SESION
@login_required
def signout(request):
    #Funcion para cerrar la sesión inicicada
    logout(request)
    #Redirije al login
    return redirect("signin")
#METODO PARA REGISTRARSE
def signup(request):
    if request.method == "GET":
        return render(request, "signup.html", {"userForm": userForm})
    else:
        username = request.POST.get('username')
        name = request.POST.get('name')
        lastName = request.POST.get('lastName')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirmPassword = request.POST.get('confirmPassword')

        if not username:
            return HttpResponse("El campo nombre de usuario es requerido")
        if not name:
            return HttpResponse("El campo nombre es requerido")
        if not lastName:
            return HttpResponse("El campo apellido es requerido")
        if not email:
            return HttpResponse("El campo correo electrónico es requerido")
        if not password:
            return HttpResponse("El campo contraseña es requerido")
        if not confirmPassword:
            return HttpResponse("El campo confirmar contraseña es requerido")
        
        if password == confirmPassword:
            try:
                createdUser = User.objects.create_user(
                    username=username,
                    first_name=name,
                    last_name=lastName,
                    email=email,
                    password=password
                )
                createdUser.save()
                login(request, createdUser)
                return HttpResponse("El usuario ha sido registrado")
            except IntegrityError:
                return HttpResponse("El usuario ya existe")
        return HttpResponse("Las contraseñas no coinciden")
#METODO PARA INICIAR SESION
def signin(request):
    #Si el metodo es GET
    if request.method == 'GET':
        #Renderiza el html llamado signin     #Diccionario de datos
        return render(request, 'signin.html', {"userForm": userForm})
    #Si es POST
    if request.method == "POST":
        #Se obtiene los valores que vengan del jquery y se asignan a una variable
        usuario = request.POST.get('username')
        contrasenia = request.POST.get('password')
        #Se valida que se haya ingresado algo en el campo donde se obtiene el valor que se le pasa a usuario
        if not usuario:
            #En caso de que no venga nada mostrar este mensaje
            return HttpResponse("Error: El campo de correo electronico es requerido")
        #Se valida que se haya ingresado algo en el campo donde se obtiene el valor que se le pasa a contrasenia
        if not contrasenia:
            #En caso de que no venga nada mostrar este mensaje
            return HttpResponse("Error: El campo de contraseña es requerido")

        #Se autentica que el usuario exista en la base de datos
        user = authenticate(request, username=usuario, password=contrasenia)
        #Si user no viene vacio(no es None)
        if user is not None:
            #Inicia la sesión
            login(request, user)
            #Redirect a home
            return JsonResponse({"redirect": "/home"})
        else:
            #En caso de que no, muestra este mensaje
            return JsonResponse({"error": "Error al iniciar sesión"}, status=400)
    #Muestra el html signin                #Diccionario de datos
    return render(request, "signin.html", {"userForm": userForm})
#VISTA DEL FORMULARIO PARA CERRAR SESION
@login_required
def changePasswordUserView(request):
    #Se obtiene el usuario que esta logeado
    userLog = request.user
    #Se crea la instancia del formulario userForm
    formUser = userForm(instance=userLog)
    #Se asigna el render de updatePassword.html a una variable
    html = render(request, "updatePassword.html", {
        'userLog': userLog,
        'formUser': formUser,
    })
    #Se retorna como HttpResponse la variable llamada html
    #Esto sirve para que devuela como respuesta el html y se 
    #pueda usar ese respone en jquery para manipularlo(pintarlo)
    return HttpResponse(html)
#METODO PARA CAMBIAR CONTRASEÑA
@login_required
def changePassword(request):
    try:
        #Se crea la instancia del usuario que esta logeado 
        user = User.objects.get(username=request.user)
        #Se asignan los valores obtenidos en jquery a la variable newPassword
        newPassword = request.POST.get('newPassword')
        #Se asignan los valores obtenidos en jquery a la variable confirmNewPassword
        confirmNewPassword = request.POST.get('confirmNewPassword')
        #Se hace una validación donde newPassword tiene que ser igual a confirmNewPassword
        if newPassword==confirmNewPassword:
            #Se setea la nueva contraseña
            #Se usa esta funcion y no asignarlo de forma directa al campo de password ya que esta
            #funcion tiene unn proceso detras donde encripta la contraseña para mantenerla segura 
            user.set_password(newPassword)
            #Se guardan los cambios
            user.save()
            #Devuelve el mensaje en caso de que todo haya sido ejecutado correctamente
            return HttpResponse("Su contraseña ha sido actualizada con éxito")
        else:
            #En caso de que las contraseñas nosean iguales devuelve este mensaje 
            return HttpResponse("Las contraseñas no coinciden")
    except:
        #Mensaje de error
        return HttpResponse("Ha ocurrido un error")
#VISTA DEL FORMULARIO PARA ACTUALIZAR USUARIO
@login_required
def userUpdateView(request):
    #Se obtiene el usuario logeado
    userLog = request.user
    #Instancia del formulario
    formUser = userForm(instance=userLog) 

    #Se especifica lo que quiero que se muestre en el input del html
    #(solo se puede con los inputs o campos del formulario)
    formUser.fields['first_name'].widget.attrs.update({
        #Aqui es donde se especifica que es lo que se mostrara
        #En este caso el nombre del usuario logeado
        'placeholder': userLog.first_name
    })
    formUser.fields['last_name'].widget.attrs.update({
        #Aqui es donde se especifica que es lo que se mostrara
        #En este caso el apellido del usuario logeado
        'placeholder': userLog.last_name
    })
    formUser.fields['email'].widget.attrs.update({
        #Aqui es donde se especifica que es lo que se mostrara
        #En este caso el email del usuario logeado
        'placeholder': userLog.email
    })
    #Se asigna el render de updateUser.html a una variable llamada html
    html = render(request, "updateUser.html", {
        'userLog': userLog,
        'formUser': formUser,
    })
    #Se retorna la variable html para poder manipularla en jquery 
    return HttpResponse(html)
#METODO PARA ACTUALIZAR USUARIO 
@login_required
def updateUser(request):
    try:
        #Se crea la instancia del usuario que esta logeado 
        user = User.objects.get(username=request.user)
        #Se obtienen los valores obtenidos en jquery y se asignan a variables
        newName = request.POST.get('newName')
        newLastName = request.POST.get('newLastName')
        newEmail = request.POST.get('newEmail')
        #Se asignan esas variables a los campos del usuario logeado
        user.first_name=newName
        user.last_name=newLastName
        user.email=newEmail
        #Se guardan los cambios
        user.save()
        #Mensaje en caso de que todo haya salido bien
        return HttpResponse("Sus datos han sido actualizadoscon éxito")
    except:
        #Mensaje en caso de que haya ocurrido un error
        return HttpResponse("Ha ocurrido un error")
#VISTA TABLA PRUEBA
@login_required    
def tableView(request):
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Sampieri
    sampieri = request.user.groups.filter(name='Sampieri').exists()
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Proveedor
    proveedor = request.user.groups.filter(name='Proveedor').exists()
    #Se asigna el render de tableTest.html a una variable llamada html
    html = render(request, "tableTest.html", {
        'proveedor': proveedor,
        'sampieri': sampieri,
    })
                  
    #Se retorna la variable html para poder manipularla en jquery 
    return HttpResponse(html)
#METODO PARA DESCARGAR ARCHIVO EXCEL
def exportTableExcel(request):
    data = json.loads(request.body)     
     # Crear un libro de trabajo y una hoja
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Prueba"

    # Escribir encabezados de la tabla
    encabezados = ['Nombre', 'Precio', 'Stock']
    ws.append(encabezados)

    # Obtener datos del modelo
    rows = data['rows']
    for row in rows:
        ws.append(row)

    # Crear la respuesta HTTP
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=productos.xlsx'

    # Guardar el libro de trabajo en la respuesta
    wb.save(response)

    return response
#VISTA DEL LISTADO DE PROVEEDORES
@login_required
def proveedoresListView(request):
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Sampieri
    sampieri = request.user.groups.filter(name='Sampieri').exists()
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Proveedor
    proveedor = request.user.groups.filter(name='Proveedor').exists()
    #Se asigna el render de proveedoresList.html a la variable llamada html
    html = render(request, 'proveedoresList.html', {
        'sampieri': sampieri,
        'proveedor': proveedor,
    })
    return HttpResponse(html)
#VISTA DE LA TABLA CON INFORMACION DE LOS PROVEEDORES 
@login_required
def proveedoresTablaView(request):
    sampieri = request.user.groups.filter(name='Sampieri').exists()
    #Esta línea sirve para filtrar por el nombre el grupo al que pertenece el usuario logeado en este caso por el nombre de Proveedor
    proveedor = request.user.groups.filter(name='Proveedor').exists()
    #Se obtiene la lista de los proveedores
    proveedoresList = proveedores.objects.all()
    #Se asigna el render de proveedoresList.html a la variable llamada html
    html = render(request, 'tablaProveedores.html', {
        'proveedores': proveedoresList,
        'sampieri': sampieri,
        'proveedor': proveedor,
    })
    return HttpResponse(html)
#VISTA DEL FORMULARIO PARA ACTUALIZAR LOS PROVEEDORES
@login_required
def proveedorUpdateView(request):
    if request.method == 'POST':
        #Obtengo el id desde la jquery
        proveedor_id = request.POST.get('idProveedor')
        #Obtener el proveedor con el ID obtenido
        proveedor = get_object_or_404(proveedores, id=proveedor_id)
        #Se obtiene la lista de los proveedores
        formProveedor = proveedoresForm(instance=proveedor)
        
        #Se asigna el render de updateUser.html a una variable llamada html
        html = render(request, "updateProveedor.html", {
            'formProveedor': formProveedor,
        })
        #Se retorna la variable html para poder manipularla en jquery 
        return HttpResponse(html)
    else:
        return HttpResponse("Solicitud no válida")
#METODO PARA ACTUALIZAR LOS PROVEEDORES
@login_required
def updateProveedor(request):
    try:
        #Se crea la instancia del usuario que esta logeado 
        proveedor_id = request.POST.get('idProveedor')
        # Obtener el registro del proveedor con el ID proporcionado
        proveedor = proveedores.objects.get(id=proveedor_id)
        #Se obtienen los valores obtenidos en jquery y se asignan a variables
        newNombre = request.POST.get('newNombre')
        newTelefono = request.POST.get('newTelefono')
        newEmail = request.POST.get('newEmail')
        newDireccion = request.POST.get('newDireccion')
        newCodigoPostal = request.POST.get('newCodigoPostal')
        #Se asignan esas variables a los campos del proveedor
        proveedor.nombre=newNombre
        proveedor.telefono=newTelefono
        proveedor.email=newEmail
        proveedor.direccion=newDireccion
        proveedor.codigoPostal=newCodigoPostal
        #Se guardan los cambios
        proveedor.save()
        #Mensaje en caso de que todo haya salido bien
        return HttpResponse("Sus datos han sido actualizadoscon éxito")
    except:
        #Mensaje en caso de que haya ocurrido un error
        return HttpResponse("Ha ocurrido un error")
    #Tengo este metodo donde quiero actualizar un registro como obtengo su id para indicar cualquiero 