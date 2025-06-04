import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import Quiz, QuizLike, Profile
from .serializers import (
    QuizSerializer,
    RegistrationSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    """
    POST /api/register/
    Body JSON:
      {
        "username": "johndoe",
        "password": "supersecret",
        "role": "WRITER"  # or ADMIN, VISITOR
      }
    Returns 201:
      {
        "username": "...",
        "role": "..."
      }
    Or 400 with appropriate error message.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response(
            {
                "username": user.username,
                "role": user.profile.role,
            },
            status=status.HTTP_201_CREATED,
        )


class ObtainTokenWithPermissions(APIView):
    """
    POST /api/token/
    Body JSON:
      {
        "username": "...",
        "password": "..."
      }
    Returns 200:
      {
        "access": "<jwt_access_token>",
        "refresh": "<jwt_refresh_token>"
      }
    If invalid credentials → 401.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Both 'username' and 'password' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            role = user.profile.role
        except Profile.DoesNotExist:
            role = "VISITOR"

        refresh = RefreshToken.for_user(user)
        refresh["role"] = role

        access = refresh.access_token
        access.set_exp(lifetime=datetime.timedelta(minutes=1))

        return Response(
            {"access": str(access), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class HasAPIPermissions(BasePermission):
    """
    - ADMIN: full access (GET, POST, PUT, PATCH, DELETE on /quizzes/)
    - WRITER: GET, POST, PUT, PATCH on /quizzes/; also allowed to like/unlike
    - VISITOR: only GET on /quizzes/ (safe methods); but also allowed to like/unlike
    - Any authenticated user may call the custom 'like' or 'unlike' actions
    - DELETE on /quizzes/{id}/ (destroy) is only for ADMIN
    """

    def has_permission(self, request, view):
        token = request.auth
        if not token:
            return False

        payload = getattr(token, "payload", {})
        role = payload.get("role")

        if getattr(view, "action", None) in ("like", "unlike"):
            return True

        if role:
            r = role.upper()
            if r == "ADMIN":
                return True
            if r == "WRITER":
                if request.method in SAFE_METHODS or request.method in ("POST", "PUT", "PATCH"):
                    return True
                return False
            if r == "VISITOR":
                return request.method in SAFE_METHODS
            return False

        return False


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by("-created_at")
    serializer_class = QuizSerializer
    permission_classes = [HasAPIPermissions]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]

    @action(detail=True, methods=["post"], permission_classes=[HasAPIPermissions])
    def like(self, request, pk=None):
        quiz = self.get_object()
        user = request.user

        like_obj, created = QuizLike.objects.get_or_create(user=user, quiz=quiz)
        if not created:
            return Response(
                {"detail": "You have already liked this quiz."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        quiz.likes = QuizLike.objects.filter(quiz=quiz).count()
        quiz.save()
        return Response({"likes": quiz.likes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["delete"], permission_classes=[HasAPIPermissions])
    def unlike(self, request, pk=None):
        quiz = self.get_object()
        user = request.user

        try:
            like_obj = QuizLike.objects.get(user=user, quiz=quiz)
            like_obj.delete()
        except QuizLike.DoesNotExist:
            return Response(
                {"detail": "You have not liked this quiz."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quiz.likes = QuizLike.objects.filter(quiz=quiz).count()
        quiz.save()
        return Response({"likes": quiz.likes}, status=status.HTTP_200_OK)
