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
        request = self.context.get('request')
        validated_data['username'] = validated_data.get('email')
        if request and request.user and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        else:
            validated_data['created_by'] = None
        return Usuario.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        if request and request.user and request.user.is_authenticated:
            instance.updated_by = request.user
        else:
            instance.updated_by = None
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance