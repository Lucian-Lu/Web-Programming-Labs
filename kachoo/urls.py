from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, RegisterView, ObtainTokenWithPermissions
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"quizzes", QuizViewSet, basename="quiz")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", ObtainTokenWithPermissions.as_view(), name="token_obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
