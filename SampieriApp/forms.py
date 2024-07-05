from django import forms
from.models import proveedores
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class userForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
        ]
        labels = {
            'username': ("Usuario:"),
            'first_name': ("Nombre(s):"),
            'last_name': ("Apellido:"),
            'email': ("Correo electrónico:"),
            'password': ("CONTRASEÑA"),
        }
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Usuario'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre(s)'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Apellido'}),
            'email': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Correo electrónico'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}),
        }
        
class proveedoresForm(forms.ModelForm):
    class Meta:
        model = proveedores
        fields = [
            'nombre',
            'telefono',
            'email',
            'direccion',
            'codigoPostal'
        ]
        labels = {
            'nombre': ("Nombre:"),
            'telefono': ("Teléfono:"),
            'email': ("Correo electrónico:"),
            'direccion': ("Dirección"),
            'codigoPostal': ("Código postal:")
        }
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Teléfono'}),
            'email': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Correo electrónico'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dirección'}),
            'codigoPostal': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Código postal'})
        }