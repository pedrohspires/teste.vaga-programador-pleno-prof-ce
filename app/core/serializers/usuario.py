from rest_framework import serializers
from app.core.models.usuario import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    created_by_detail = serializers.ReadOnlyField(source='created_by.email')
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'nome', 'email', 'password', 'tipo', 
            'created_at', 'updated_at', 'created_by_detail'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance