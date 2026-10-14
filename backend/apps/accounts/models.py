import re
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedUUIDModel

def validate_kenyan_phone(value):
    """
    Validates E.164 phone format or Kenyan standard:
    Accepts: +2547XXXXXXXX, 2547XXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
    """
    cleaned = re.sub(r'[\s\-\(\)]', '', value)
    if re.match(r'^(?:\+254|254|0)?([71]\d{8})$', cleaned):
        return
    raise ValidationError("Enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678).")

def normalize_kenyan_phone(phone_str):
    """
    Normalizes any Kenyan phone string to 2547XXXXXXXX or 2541XXXXXXXX format.
    """
    cleaned = re.sub(r'[\s\-\(\)\+]', '', str(phone_str))
    if cleaned.startswith('0') and len(cleaned) == 10:
        return '254' + cleaned[1:]
    if cleaned.startswith('254') and len(cleaned) == 12:
        return cleaned
    if len(cleaned) == 9 and (cleaned.startswith('7') or cleaned.startswith('1')):
        return '254' + cleaned
    return cleaned

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email).lower()
        if 'phone' in extra_fields and extra_fields['phone']:
            extra_fields['phone'] = normalize_kenyan_phone(extra_fields['phone'])
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, TimeStampedUUIDModel):
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', 'Customer'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True, validators=[validate_kenyan_phone])
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} <{self.email}>"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

class PasswordResetToken(TimeStampedUUIDModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token_hash = models.CharField(max_length=128, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"ResetToken for {self.user.email} (used={self.is_used})"
