# Guia de Configuração do MongoDB

## Erro: "bad auth : authentication failed"

Este erro ocorre quando as credenciais do MongoDB estão incorretas ou o URI não está configurado corretamente.

## Soluções

### 1. MongoDB Atlas (Recomendado para Produção)

Se você está usando MongoDB Atlas:

#### Passo 1: Verifique suas credenciais
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Vá em **Database Access** e verifique se o usuário existe
3. Se necessário, crie um novo usuário ou redefina a senha

#### Passo 2: Configure o acesso de rede
1. Vá em **Network Access**
2. Adicione seu IP atual ou `0.0.0.0/0` (permite todos os IPs - apenas para desenvolvimento)

#### Passo 3: Configure o arquivo .env
Copie o URI de conexão do Atlas e configure no `.env`:

```env
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/daily-quest-db?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRATION=1d
PORT=3000
NODE_ENV=development
```

**IMPORTANTE:** 
- Substitua `SEU_USUARIO` pelo nome de usuário do banco
- Substitua `SUA_SENHA` pela senha (certifique-se de fazer URL encoding de caracteres especiais)
- Substitua `cluster0.xxxxx.mongodb.net` pelo seu cluster
- Substitua `daily-quest-db` pelo nome do seu banco de dados

#### Caracteres Especiais na Senha
Se sua senha contém caracteres especiais, você precisa fazer URL encoding:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- `%` → `%25`

Exemplo:
- Senha original: `Pass@123`
- Senha codificada: `Pass%40123`

### 2. MongoDB Local (Desenvolvimento)

Se você está rodando MongoDB localmente:

#### Opção A: MongoDB sem autenticação (padrão)
```env
MONGODB_URI=mongodb://localhost:27017/daily-quest-db
```

#### Opção B: MongoDB com autenticação
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/daily-quest-db?authSource=admin
```

### 3. Docker Compose (Desenvolvimento)

Crie um `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: daily-quest-mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: daily-quest-db
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Depois configure o `.env`:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/daily-quest-db?authSource=admin
```

Execute:
```bash
docker-compose up -d
```

## Testando a Conexão

Depois de configurar, teste a aplicação:

```bash
npm run start:dev
```

Se a conexão for bem-sucedida, você verá:
```
✅ [MongoDB] Conectado com sucesso!
```

## Troubleshooting Adicional

### Erro persiste?

1. **Verifique se o arquivo .env existe:**
   ```bash
   ls -la .env
   ```
   Se não existir, copie do exemplo:
   ```bash
   cp .env.example .env
   ```

2. **Verifique o conteúdo do .env:**
   ```bash
   cat .env
   ```

3. **Teste a URI do MongoDB diretamente:**
   ```bash
   # Instale o mongosh se necessário
   mongosh "mongodb+srv://usuario:senha@cluster.mongodb.net/"
   ```

4. **Verifique logs de rede:**
   - MongoDB Atlas: Verifique se seu IP está na whitelist
   - Firewall: Certifique-se de que a porta 27017 (local) ou 27015-27017 (Atlas) não está bloqueada

5. **Limpe o cache do npm:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Ambiente de Desenvolvimento Rápido

Para começar rapidamente sem configurar MongoDB:

1. Use MongoDB Atlas Free Tier (M0)
2. Crie um cluster em https://cloud.mongodb.com/
3. Crie um usuário de banco de dados
4. Adicione `0.0.0.0/0` ao Network Access (apenas dev!)
5. Copie a connection string e cole no `.env`

## Suporte

Se o problema persistir, verifique:
- Os logs completos da aplicação
- A versão do MongoDB que você está usando
- Se há conflitos de porta (27017)
