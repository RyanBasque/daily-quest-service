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

### Progresso Anual (Annual Progress)

Todos os endpoints requerem autenticação JWT.

- `GET /progress/annual` - Lista todo o progresso anual do usuário
- `GET /progress/annual/:year` - Obtém o progresso anual de um ano específico
  - Exemplo: `GET /progress/annual/2026`
- `POST /progress/annual` - Cria novo progresso anual
  ```json
  {
    "year": 2026,
    "progressPercentage": 75.5,
    "totalTasks": 100,
    "completedTasks": 75
  }
  ```

### Progresso Semanal (Weekly Progress)

Todos os endpoints requerem autenticação JWT.

- `GET /progress/weekly` - Lista todo o progresso semanal do usuário
- `GET /progress/weekly?year=2026` - Lista o progresso semanal de um ano específico
- `GET /progress/weekly/:year/:week` - Obtém o progresso de uma semana específica
  - Exemplo: `GET /progress/weekly/2026/7`
- `POST /progress/weekly` - Cria novo progresso semanal
  ```json
  {
    "year": 2026,
    "weekNumber": 7,
    "progressPercentage": 85.0,
    "totalTasks": 20,
    "completedTasks": 17
  }
  ```

### Usuários Mockados

- Email: `admin@example.com` | Senha: `admin123`
- Email: `user@example.com` | Senha: `user123`

## Licença

MIT
