# Documentação da API - Daily Quest Service

Esta documentação detalha os endpoints disponíveis no serviço Daily Quest.

**Base URL**: `http://localhost:3000` (padrao)

## Autenticação

A maioria dos endpoints requer autenticação via Bearer Token. O token JWT é obtido através do endpoint de login.

Inclua o token no header da requisição:
`Authorization: Bearer <seu_token_jwt>`

---

## 1. Autenticação (`/auth`)

### Registrar Novo Usuário
Cria uma nova conta de usuário.

- **Endpoint**: `POST /auth/register`
- **Acesso**: Público
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123", // Mínimo 6 caracteres
    "name": "Nome do Usuário"
  }
  ```
- **Resposta Sucesso (201 Created)**:
  ```json
  {
    "message": "Usuário criado com sucesso",
    "user": {
      "id": "uuid-do-usuario",
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
  }
  ```

### Login
Autentica um usuário e retorna o token de acesso.

- **Endpoint**: `POST /auth/login`
- **Acesso**: Público
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123"
  }
  ```
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXvc...",
    "user": {
      "id": "uuid-do-usuario",
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário"
    }
  }
  ```

---

## 2. Usuários (`/users`)

### Obter Perfil do Usuário
Retorna as informações do usuário autenticado.

- **Endpoint**: `GET /users/profile`
- **Acesso**: Privado (Requer Token)
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "createdAt": "2023-10-27T10:00:00.000Z"
  }
  ```

---

## 3. Missões (Quests) (`/quests`)

Gerencie as missões diárias, semanais e anuais.

### Criar Missão
- **Endpoint**: `POST /quests`
- **Acesso**: Privado
- **Body**:
  ```json
  {
    "title": "Ler 30 minutos",
    "description": "Livro de TypeScript", // Opcional
    "type": "DAILY", // Enum: 'DAILY', 'WEEKLY', 'ANNUAL'
    "dueDate": "2023-10-28T00:00:00.000Z" // Opcional
  }
  ```
- **Resposta Sucesso (201 Created)**: Objeto da missão criada.

### Listar Missões
Retorna todas as missões do usuário.

- **Endpoint**: `GET /quests`
- **Acesso**: Privado
- **Resposta Sucesso (200 OK)**: Array de objetos de missão.

### Atualizar Missão
Atualiza uma missão existente.

- **Endpoint**: `PUT /quests/:id`
- **Acesso**: Privado
- **Parâmetros de URL**: `id` da missão.
- **Body** (todos opcionais):
  ```json
  {
    "title": "Novo título",
    "description": "Nova descrição",
    "status": "COMPLETED", // Enum: 'TODO', 'COMPLETED'
    "dueDate": "2023-10-29T00:00:00.000Z"
  }
  ```

### Deletar Missão
Remove uma missão.

- **Endpoint**: `DELETE /quests/:id`
- **Acesso**: Privado
- **Parâmetros de URL**: `id` da missão.
- **Resposta Sucesso (204 No Content)**.

---

## 4. Progresso (`/progress`)

Acompanhe o progresso das missões. O sistema suporta progresso Diário, Semanal e Anual.

### Obter Progresso
Retorna o progresso calculado para um período específico.

- **Endpoint**: `GET /progress`
- **Acesso**: Privado
- **Query Parameters**:
  - `type` (Obrigatório): Tipo de progresso. Valores: `DAILY`, `WEEKLY`, `ANNUAL`.
  - `year` (Obrigatório): Ano numérico (ex: 2023).
  - `week` (Opcional): Número da semana (1-53). Obrigatório se `type=WEEKLY`.
  
  **Exemplos de chamada:**
  - Diário: `GET /progress?type=DAILY&year=2023` (Pega o dia de hoje, ou necessita de data específica se implementado)
  - Semanal: `GET /progress?type=WEEKLY&year=2023&week=43`
  - Anual: `GET /progress?type=ANNUAL&year=2023`

- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "id": "...",
    "userId": "...",
    "type": "WEEKLY",
    "year": 2023,
    "weekNumber": 43,
    "progressPercentage": 50,
    "totalTasks": 10,
    "completedTasks": 5,
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

### Sincronizar Progresso (Recalcular)
Força o recálculo de todo o progresso (Diário, Semanal e Anual) com base no estado atual das missões. Útil se houver inconsistências.

- **Endpoint**: `POST /progress/sync`
- **Acesso**: Privado
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "weekly": { ... },
    "annual": { ... },
    "daily": { ... }
  }
  ```

---

## 5. Health Check (`/health`)

Verifica se o serviço está operante.

- **Endpoint**: `GET /health`
- **Acesso**: Público
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "status": "ok",
    "timestamp": "2023-10-27T10:00:00.000Z",
    "service": "Daily Quest API"
  }
  ```
