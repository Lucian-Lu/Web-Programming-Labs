from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Quiz, QuizLike
from .serializers import QuizSerializer
from .permissions import HasAPIPermissions

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    permission_classes = [HasAPIPermissions]

    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    @action(detail=True, methods=['post'], permission_classes=[HasAPIPermissions])
    def like(self, request, pk=None):
        quiz = self.get_object()
        user = request.user

        like_obj, created = QuizLike.objects.get_or_create(user=user, quiz=quiz)
        if not created:
            return Response(
                {"detail": "You have already liked this quiz."},
                status=status.HTTP_400_BAD_REQUEST
            )
        quiz.likes = QuizLike.objects.filter(quiz=quiz).count()
        quiz.save()
        return Response({"likes": quiz.likes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], permission_classes=[HasAPIPermissions])
    def unlike(self, request, pk=None):
        quiz = self.get_object()
        user = request.user

        try:
            like_obj = QuizLike.objects.get(user=user, quiz=quiz)
            like_obj.delete()
        except QuizLike.DoesNotExist:
            return Response(
                {"detail": "You have not liked this quiz."},
                status=status.HTTP_400_BAD_REQUEST
            )

        quiz.likes = QuizLike.objects.filter(quiz=quiz).count()
        quiz.save()
        return Response({"likes": quiz.likes}, status=status.HTTP_200_OK)
