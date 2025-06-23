from rest_framework import viewsets
from .models import User, Job, Application, Order, Post
from .serializers import UserSerializer, JobSerializer, ApplicationSerializer, OrderSerializer, PostSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all() 
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = Job.objects.all()
        employer_id = self.request.query_params.get('employerId')
        if employer_id:
            queryset = queryset.filter(employerId=employer_id)
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()  
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        user_id = self.request.query_params.get('user') or self.request.query_params.get('userId')
        status = self.request.query_params.get('status')
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        queryset = Application.objects.all()
        user_id = self.request.query_params.get('userId')
        if user_id:
            queryset = queryset.filter(userId__id=user_id)  # ✅ CORRECT
        return queryset

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        job_seeker_id = self.request.query_params.get('jobSeekerId')
        if job_seeker_id:
            queryset = queryset.filter(jobSeekerId__id=job_seeker_id)  # ✅ FIXED
        return queryset

    


import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def create_order(request):
    user = request.data.get('user')
    amount = int(request.data.get('amount')) * 100  # in paise

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    payment = client.order.create({'amount': amount, 'currency': 'INR', 'payment_capture': 1})

    return Response({
        'order_id': payment['id'],
        'amount': payment['amount'],
        'currency': payment['currency'],
        'razorpay_key': settings.RAZORPAY_KEY_ID
    })
