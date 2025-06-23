from django.contrib import admin
from .models import User, Job, Application, Order, Post

admin.site.register(User)
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(Order)
admin.site.register(Post)
