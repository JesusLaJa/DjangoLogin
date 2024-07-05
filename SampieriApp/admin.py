from django.contrib import admin
from .models import proveedores, proveedoresUsuarios, ArtUnidad, Art

# Register your models here.
admin.site.register(proveedores)
admin.site.register(proveedoresUsuarios)
admin.site.register(Art)
admin.site.register(ArtUnidad)