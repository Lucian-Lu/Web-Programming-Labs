from django.db import models
from django.contrib.auth.models import User

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    likes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    wrong_answers = models.JSONField(default=list)

class QuizLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, related_name='likes_relation', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quiz')
