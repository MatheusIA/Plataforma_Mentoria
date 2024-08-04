# Plataforma Mentoria

Plataforma de Mentorias. 
Esta plataforma deve atender a dois públicos distintos: pessoas que possuem habilidades e estão dispostas a oferecer mentoria, e pessoas que precisam de mentoria nessas habilidades

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para o backend.
- **Fastify**: Framework web para construção de APIs rápidas e eficientes.
- **Prisma ORM**: Ferramenta de mapeamento objeto-relacional para interagir com o banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar dados.
- **Fastify Swagger**: Plugin para gerar e visualizar a documentação Swagger da API.
- **Google Calendar API**: Integrado para agendar e gerenciar eventos de mentoria.
- **Docker Compose**: Utilizado para orquestrar serviços, como o banco de dados PostgreSQL.

## Arquitetura

O projeto segue uma arquitetura modular com a seguinte estrutura de diretórios:

- **prisma/**: Contém o schema do banco de dados Prisma.
- **src/domain/**: Contém os casos de uso e as fábricas (factories) que implementam a lógica de negócios.
- **src/http/controller/**: Contém todos os controladores responsáveis por lidar com as requisições HTTP.
- **src/repositories/**: Contém os repositórios que interagem com a camada de persistência.
  - **primsa/**: Repositórios específicos para o Prisma ORM.
  - **in-memory/**: Repositórios em memória para simular operações durante os testes.

## Configuração e Execução do Projeto

### Pré-requisitos

- Node.js (v16.0.0 ou superior)
- Docker e Docker Compose
- PostgreSQL
- Conta do Google e credenciais para a API do Google Calendar

### Passos para Configuração

1. **Clone o Repositório disponivel no link**

   https://github.com/MatheusIA/Plataforma_Mentoria.git

2. **Inicie o Banco de Dados com o Docker Compose**

   Comando no terminal: 
   ```bash
   docker-compose up -d

3. **Instale as Dependências**

   No terminal, execute o seguinte comando:
   ```bash
   npm install

4. **Instale as Dependencias para os testes e2e**

   No terminal, execute os seguintes comandos:
   ```bash
   npm run test:create-prisma-environment  # Para fazer o link com a pasta vites-environment-prisma, seguindo o padrão do vitest
   npm run test:install-prisma-environment  # Para instalar as dependências do teste


5. **Configure o arquivo .env**

   Configure conforme o arquivo .env.example (Irei deixar alguns dados para facilitar a configuração)

6. **Execute as migrações do Prisma**

   No terminal, execute o seguinte comando:
   ```bash
   npx prisma migrate dev

7. **Faça o build da aplicação**

   No terminal, execute o seguinte comando:
      ```bash
   npm run build

8. **Inicie o servidor**

   No terminal, execute o seguinte comando:
      ```bash
   npm run start:dev

9. **Acesso a documentação da API**

   No terminal, execute o comando:
      ```bash
   npm run start:dev

   Após isso, a documentação Swagger está disponível em http://localhost:3000/docs

10. **Execute os testes unitários e e2e**

   No terminal, execute os seguintes comandos:
     
    ```bash   
   npm run test # Teste unitário
   npm run test:e2e # Teste e2e
   npm run test:e2e:watch # Teste e2e modo watch

