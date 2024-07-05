"""
URL configuration for Sampieri project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from SampieriApp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('export/excel', views.exportTableExcel, name="exportExcel"),
    path('', views.home, name="home"),
    path('home/', views.home, name="home"),
    # LOGIN #
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name="signup"), 
    path('signout/', views.signout, name="signout"),
    # MENU #
    path('menu/tableView/', views.tableView, name="tableView"),
    # USUARIOS #
    path('usuarios/changePasswordUserView/', views.changePasswordUserView, name="changePasswordUserView"),
    path('usuarios/changePassword/', views.changePassword, name="changePassword"),
    path('usuarios/userUpdateView/', views.userUpdateView, name="userUpdateView"),
    path('usuarios/updateUser/', views.updateUser, name="updateUser"),
    # PROVEEDORES #
    path('proveedor/proveedoresListView/', views.proveedoresListView, name="proveedoresListView"),
    path('proveedor/proveedoresTablaView/', views.proveedoresTablaView, name="proveedoresTablaView"),
    path('proveedor/proveedorUpdateView/', views.proveedorUpdateView, name="proveedorUpdateView"),
    path('proveedor/updateProveedor/', views.updateProveedor, name="updateProveedor"),
]
