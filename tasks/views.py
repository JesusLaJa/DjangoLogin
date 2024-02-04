from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError
from .forms import TaskForm
from .models import Task
from django.utils import timezone
from django.contrib.auth.decorators import login_required


def home(request):
    return render(request, "home.html")

def signup(request):
    if request.method == "GET":
        print("Enviando formulario")
        return render(request, "signup.html", {"form": UserCreationForm}  # Diccionario de datos
        )
    else:
        if request.POST["password1"] == request.POST["password2"]:
            try:
                # Registrar usuario
                user = User.objects.create_user(
                    username=request.POST["username"],
                    password=request.POST["password1"],
                )
                user.save()
                login(request, user)
                return redirect("tasks")
            except IntegrityError:
                # valida que el usuario ya existe
                return render(
                    request,
                    "signup.html",
                    {"form": UserCreationForm, "error": "El ususario ya existe"},
                )
        # valida que las contraseñas no coinciden
        return render(
            request,
            "signup.html",
            {  # Diccionario de
                "form": UserCreationForm,
                "error": "Las contraseñas no coinciden",
            },
        )
#comentario
@login_required
def tasks(request):
    #con esta linea se filtran las tareas para que solo sean mostradas aquellas que son del usuario que inicio sesion
    tasks = Task.objects.filter(user=request.user, datecompleted__isnull=True)
    #aqui es en donde se enlistan las tareas
    return render(request, "tasks.html",  {'tasks': tasks})

@login_required
def tasksCompleted(request):
    tasks = Task.objects.filter(user=request.user, datecompleted__isnull=False).order_by('-datecompleted')
    return render(request, "tasks.html",  {'tasks': tasks})

@login_required
def createTask(request):
    #En caso de que se quiera crear una tarea este metodo me mostrara el formulario para crear una nueva tare 
    if request.method == "GET":
        return render(request, "create_task.html", {
        'form': TaskForm
        })
    #En caso de que se ya se haya creado la tarea la guardara y verificara que no se haya ingresado algun dato que no sea valido
    else:
        try:
            form = TaskForm(request.POST)
            new_task = form.save(commit=False)
            new_task.user = request.user
            new_task.save()
            return redirect('tasks')
        except ValueError:
            return render(request, 'create_task.html', {
                'form': TaskForm,
                'error': 'Por favor introduzca datos que sean validos'
            })
    
@login_required    
def taskDetail(request, task_id):
    if request.method == 'GET':
        task = get_object_or_404(Task, pk=task_id, user=request.user)
        form = TaskForm(instance=task)
        return render(request, 'task_detail.html', {
        'task': task,
        'form': form
    })
    else:
        try:
            task = get_object_or_404(Task, pk=task_id, user=request.user)
            form = TaskForm(request.POST, instance=task)
            form.save()
            return redirect('tasks')
        except ValueError:
            return render(request, 'task_detail.html', {
        'task': task,
        'form': form,
        'error': "Error al actualizar los datos"
    })

@login_required        
def taskComplete(request, task_id):
    task = get_object_or_404(Task, pk=task_id, user=request.user)
    if request.method == "POST":
        task.datecompleted = timezone.now()
        task.save()
        return redirect('tasks')

@login_required
def taskDelete(request, task_id):
    task = get_object_or_404(Task, pk=task_id, user=request.user)
    if request.method == "POST":
        task.delete()
        return redirect('tasks')

@login_required
def signout(request):
    logout(request)
    return redirect("principal")


def signin(request):
    #verifica que si el metodo es GET use el formulario para iniciar sesion
    if request.method == "GET":
        return render(request, "signin.html", {"form": AuthenticationForm})
    #en caso de no ser metodo GET significa que estan enviando datos
    else:
        #comprueba si los datos enviados son validos
        user = authenticate(
            request,
            username=request.POST["username"],
            password=request.POST["password"])
        #si los datos no son validos entonces enviara el error de que alguno de los datos enviados no existen
        if user is None:
             return render(request, "signin.html", {
                 "form": AuthenticationForm,
                 'error': 'El usuario o la contraseña son incorrectos'})
        #en caso de que los datos enviados si sean validos o existan iniciara sesion
        else:
            login(request, user)
            return redirect('tasks')