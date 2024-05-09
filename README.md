# Node.js – Exemplo de autenticação JWT com exemplo PostgreSQL

## Registro de usuário, login de usuário e processo de autorização.
O diagrama mostra o fluxo de como implementamos o processo de registro de usuário, login de usuário e autorização.

## Instalação do Projeto
```
npm install
```

Lembre-se de editar os dados referente ao banco de dados: `app/config/db.config.js` com as credenciais corretas do banco de dados.

### Run
```
node server.js
```
> Crie uma pasta dentro de app chamada config, e inclua os arquivos auth.config.js e db.config.js conforme abaixo: 

> auth.config.js

```
module.exports = {
  secret: "sua_palavra_secreta"
};

```

> db.config.js
```
module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "seu_password",
  DB: "nome_banco",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

```

> Neste exemplo estamos utilizando PostgresSql localmente (localhost)