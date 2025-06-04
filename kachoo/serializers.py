from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quiz, Question, QuizLike, Profile


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        username = validated_data["username"]
        password = validated_data["password"]
        role = validated_data["role"]

        # Create the User
        user = User(username=username)
        user.set_password(password)
        user.save()

        # Create the associated Profile
        Profile.objects.create(user=user, role=role)
        return user


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "correct_answer", "wrong_answers"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    liked = serializers.SerializerMethodField()
    likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "title", "description", "image_url", "likes", "liked", "questions"]
        read_only_fields = ["likes", "liked"]

    def get_liked(self, obj):
        request = self.context.get("request", None)
        if request is None or request.user.is_anonymous:
            return False
        from .models import QuizLike

        return QuizLike.objects.filter(quiz=obj, user=request.user).exists()

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        quiz = Quiz.objects.create(**validated_data)
        for q_data in questions_data:
            Question.objects.create(quiz=quiz, **q_data)
        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", None)
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.image_url = validated_data.get("image_url", instance.image_url)
        instance.save()

        if questions_data is not None:
            instance.questions.all().delete()
            for q_data in questions_data:
                Question.objects.create(quiz=instance, **q_data)

        return instance
