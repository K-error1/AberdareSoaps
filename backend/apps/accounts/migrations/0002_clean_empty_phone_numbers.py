from django.db import migrations

def clean_empty_phones(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    # Update existing empty string or whitespace phone numbers to None (NULL in DB)
    User.objects.filter(phone='').update(phone=None)

def reverse_clean_empty_phones(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(clean_empty_phones, reverse_clean_empty_phones),
    ]
