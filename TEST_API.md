# Testes da API - NestJS Auth

## 1. Registrar novo usuário

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

## 2. Fazer login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

## 3. Ver perfil (substitua SEU_TOKEN pelo token recebido no login)

```bash
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer SEU_TOKEN"
```
