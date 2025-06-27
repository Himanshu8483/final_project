from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import razorpay

from .models import User, Job, Application, Order, Post
from .serializers import (
    UserSerializer, JobSerializer,
    ApplicationSerializer, OrderSerializer, PostSerializer
)

# -------------------------
# ModelViewSets
# -------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    # queryset = Job.objects.all()  
    def get_queryset(self):
        employer_id = self.request.query_params.get('employerId')
        if employer_id:
            return Job.objects.filter(employerId=employer_id)
        return Job.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
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
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('userId')
        if user_id:
            return Application.objects.filter(userId__id=user_id)
        return Application.objects.all()


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        job_seeker_id = self.request.query_params.get('jobSeekerId')
        if job_seeker_id:
            return Post.objects.filter(jobSeekerId__id=job_seeker_id)
        return Post.objects.all()


# -------------------------
# Razorpay Order API
# -------------------------

@api_view(['POST'])
def create_order(request):
    user = request.data.get('user')
    amount = int(request.data.get('amount', 0)) * 100  # Convert to paise

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    payment = client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': 1
    })

    return Response({
        'order_id': payment['id'],
        'amount': payment['amount'],
        'currency': payment['currency'],
        'razorpay_key': settings.RAZORPAY_KEY_ID
    })
