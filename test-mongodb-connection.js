#!/usr/bin/env node

/**
 * Script para testar a conexão com o MongoDB
 * Usage: node test-mongodb-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Testando conexão com MongoDB...\n');

if (!MONGODB_URI) {
  console.error('❌ Erro: MONGODB_URI não está definido no arquivo .env');
  console.error('💡 Copie o arquivo .env.example para .env e configure a URI do MongoDB\n');
  process.exit(1);
}

console.log('🔗 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!\n');
    console.log('📊 Detalhes da conexão:');
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Nome do banco: ${mongoose.connection.name}`);
    console.log(`   - Estado: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    console.log('');
    
    mongoose.connection.close();
    console.log('✓ Teste concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha ao conectar ao MongoDB\n');
    console.error('Erro:', error.message);
    console.error('');
    
    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.error('💡 Solução: Verifique suas credenciais no arquivo .env');
      console.error('   - Usuário e senha estão corretos?');
      console.error('   - Senha com caracteres especiais precisa de URL encoding');
      console.error('   - Exemplo: Pass@123 → Pass%40123\n');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solução: MongoDB não está rodando localmente');
      console.error('   - Inicie o MongoDB: sudo systemctl start mongod (Linux)');
      console.error('   - Ou use MongoDB Atlas (cloud): https://cloud.mongodb.com\n');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('💡 Solução: URL do MongoDB está incorreta');
      console.error('   - Verifique o MONGODB_URI no arquivo .env');
      console.error('   - Para MongoDB local: mongodb://localhost:27017/database');
      console.error('   - Para MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/database\n');
    }
    
    console.error('📖 Veja o guia completo em: MONGODB_SETUP.md\n');
    process.exit(1);
  });
