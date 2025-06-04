from rest_framework.permissions import BasePermission, SAFE_METHODS

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

        perms = payload.get("permissions")
        if perms:
            if request.method in SAFE_METHODS:
                return "READ" in perms
            else:
                return "WRITE" in perms

        return False
