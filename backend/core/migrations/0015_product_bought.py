# Generated by Django 5.0.7 on 2024-08-04 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_journey_productjourney'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='bought',
            field=models.BooleanField(default=False),
        ),
    ]
