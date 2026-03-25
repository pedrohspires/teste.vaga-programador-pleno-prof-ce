from rest_framework.views import exception_handler
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
        if response is not None:
            response.data = {
                "detail": "Acesso negado. Por favor, realize o login para continuar."
            }
            
    return response