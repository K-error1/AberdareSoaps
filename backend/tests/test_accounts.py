import pytest
from rest_framework.test import APIClient
from apps.accounts.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_create_multiple_users_with_empty_phone(api_client):
    # Test registering first user with empty string phone
    res1 = api_client.post('/api/accounts/register/', {
        'name': 'User One',
        'email': 'user1@example.com',
        'phone': '',
        'password': 'SecurePassword123!'
    }, format='json')
    assert res1.status_code == 201
    user1 = User.objects.get(email='user1@example.com')
    assert user1.phone is None

    # Test registering second user with empty string phone (should not raise UniqueViolation)
    res2 = api_client.post('/api/accounts/register/', {
        'name': 'User Two',
        'email': 'user2@example.com',
        'phone': '',
        'password': 'SecurePassword123!'
    }, format='json')
    assert res2.status_code == 201
    user2 = User.objects.get(email='user2@example.com')
    assert user2.phone is None

@pytest.mark.django_db
def test_create_user_with_valid_phone(api_client):
    res = api_client.post('/api/accounts/register/', {
        'name': 'User Three',
        'email': 'user3@example.com',
        'phone': '0712345678',
        'password': 'SecurePassword123!'
    }, format='json')
    assert res.status_code == 201
    user = User.objects.get(email='user3@example.com')
    assert user.phone == '254712345678'
