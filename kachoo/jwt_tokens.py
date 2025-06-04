import datetime
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

class ObtainTokenWithPermissions(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get("username")
        perms = data.get("permissions", None)
        role = data.get("role", None)

        if not username:
            return Response(
                {"detail": "A 'username' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if perms is None and role is None:
            return Response(
                {"detail": "Either 'permissions' or 'role' must be provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user, _ = User.objects.get_or_create(username=username)

        refresh = RefreshToken.for_user(user)

        if perms is not None:
            refresh["permissions"] = perms
        if role is not None:
            refresh["role"] = role

        access = refresh.access_token
        access.set_exp(lifetime=datetime.timedelta(minutes=1))

        return Response(
            {"access": str(access), "refresh": str(refresh)},
            status=status.HTTP_200_OK
        )
