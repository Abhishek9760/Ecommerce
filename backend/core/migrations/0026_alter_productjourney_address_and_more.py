# Generated by Django 5.0.7 on 2024-09-01 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_rename_total_price_order_amount_order_cart_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productjourney',
            name='address',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='productjourney',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='productjourney',
            name='phone',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
