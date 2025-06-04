from rest_framework.routers import DefaultRouter
from .views import QuizViewSet
from .jwt_tokens import ObtainTokenWithPermissions
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')

urlpatterns = [
    path('token/', ObtainTokenWithPermissions.as_view(), name='token_obtain'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
