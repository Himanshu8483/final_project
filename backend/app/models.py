from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('employer', 'Employer'),
        ('jobseeker', 'Jobseeker')
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    employerId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    priority = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Application(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    jobId = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')

    def __str__(self):
        return f"{self.userId.name} → {self.jobId.title}"

class Post(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    resume = models.TextField(blank=True)
    jobId = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='posts')
    jobSeekerId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobseeker_posts')
    employerId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employer_posts')
    dateSent = models.DateTimeField()
    status = models.CharField(max_length=20)
    interviewDate = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"{self.title} - {self.status}"


# class Order(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
#     plan = models.CharField(max_length=20)
#     amount = models.IntegerField()
#     status = models.CharField(max_length=20)
#     start_date = models.DateTimeField(null=True)
#     expiry_date = models.DateTimeField(null=True)
class Order(models.Model):
    PLAN_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    amount = models.IntegerField()
    status = models.CharField(max_length=20, default="active")
    startDate = models.DateTimeField()
    expiryDate = models.DateTimeField()
    transactionId = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.user.name} - {self.plan} - {self.transactionId}"