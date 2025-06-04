from rest_framework.routers import DefaultRouter
from .views import QuizViewSet
from .jwt_tokens import ObtainTokenWithPermissions
from django.urls import path

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')

urlpatterns = [
    *router.urls,
    path('token/', ObtainTokenWithPermissions.as_view(), name='token_obtain'),
]
