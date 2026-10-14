from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Standardized JSON error format:
    {
        "error": {
            "code": "ERROR_CODE",
            "message": "Human readable summary",
            "details": { ... }
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_code = 'VALIDATION_ERROR' if response.status_code == 400 else 'CLIENT_ERROR'
        if response.status_code == 401:
            error_code = 'UNAUTHORIZED'
        elif response.status_code == 403:
            error_code = 'FORBIDDEN'
        elif response.status_code == 404:
            error_code = 'NOT_FOUND'
        elif response.status_code == 429:
            error_code = 'THROTTLED'

        details = response.data
        message = 'Request processing error'
        if isinstance(details, dict):
            if 'detail' in details:
                message = str(details['detail'])
            elif details:
                first_key = next(iter(details))
                message = f"{first_key}: {details[first_key]}"
        elif isinstance(details, list) and len(details) > 0:
            message = str(details[0])

        response.data = {
            'error': {
                'code': error_code,
                'message': message,
                'details': details
            }
        }
        return response

    # Unhandled server errors (500)
    logger.exception('Unhandled exception occurred', exc_info=exc)
    return Response(
        {
            'error': {
                'code': 'INTERNAL_SERVER_ERROR',
                'message': 'An unexpected server error occurred.',
                'details': {}
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
