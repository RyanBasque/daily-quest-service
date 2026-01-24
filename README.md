# Daily Quest Service

API de autenticação e serviços para o Daily Quest, desenvolvida com NestJS seguindo Clean Architecture com padrão de Use Cases.

## Características

- 🏗️ Arquitetura limpa (Clean Architecture)
- 📦 Padrão de Use Cases
- 🔐 Autenticação JWT
- 🍃 MongoDB com Mongoose
- 🔄 Dados mockados para testes

## Estrutura do Projeto

```
src/
├── domain/              # Camada de Domínio
│   ├── entities/        # Entidades de domínio
│   └── repositories/    # Interfaces de repositórios
├── application/         # Camada de Aplicação
│   └── use-cases/       # Casos de uso
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/        # Configuração do banco
│   └── repositories/    # Implementação dos repositórios
└── presentation/        # Camada de Apresentação
    ├── controllers/     # Controllers
    └── dtos/            # Data Transfer Objects
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure a URL do MongoDB na variável `MONGODB_URI`
3. Configure a chave secreta JWT na variável `JWT_SECRET`

## Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Endpoints

### Autenticação

- `POST /auth/login` - Login com credenciais
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Usuários Mockados

- Email: `admin@example.com` | Senha: `admin123`
- Email: `user@example.com` | Senha: `user123`

## Licença

MIT
