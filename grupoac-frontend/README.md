# Carteira Financeira - Desafio Full Stack

Este projeto consiste em um sistema de carteira financeira, com backend em Laravel e frontend em React, onde os usuários podem realizar transferências de saldo e depósitos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **backend/** - API RESTful em Laravel
- **frontend/** - Interface de usuário em React

## Tecnologias Utilizadas

### Backend
- PHP 8.2
- Laravel 10
- MySQL 8.0
- Docker e Docker Compose

### Frontend
- React 18
- React Router 6
- Axios
- Chart.js
- Tailwind CSS

## Requisitos do Sistema

- Docker e Docker Compose (para backend)
- Node.js 16+ (para frontend)
- npm ou yarn
- Git

## Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/carteira-financeira.git
cd carteira-financeira
```

### 2. Configuração do Backend (Docker)

```bash
# Configurar arquivo .env
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais de banco de dados:

```
DB_DATABASE=carteira
DB_USERNAME=carteira_user
DB_PASSWORD=sua_senha_segura
DB_ROOT_PASSWORD=sua_senha_root_segura
```

Iniciar os containers Docker:

```bash
docker-compose up -d
```

Executar migrações:

```bash
docker exec carteira-app php artisan migrate --seed
```

### 3. Configuração do Frontend (Local)

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local` com a URL da API:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

## Acessando a Aplicação

- Backend API: http://localhost:8000/api
- Frontend: http://localhost:3000

## Funcionalidades

1. **Autenticação**
   - Cadastro de usuários
   - Login/Logout
   - Proteção de rotas

2. **Carteira Financeira**
   - Criação de carteira para novos usuários
   - Visualização de saldo
   - Depósito de valores
   - Transferências entre carteiras
   - Estorno de transações
   - Histórico detalhado de movimentações

3. **Dashboard**
   - Resumo de saldo e transações
   - Gráficos de movimentações financeiras
   - Últimas transações realizadas

## Requisitos do Desafio Implementados

- [x] Criar cadastro
- [x] Criar autenticação
- [x] Enviar, receber e depositar dinheiro
- [x] Validar saldo antes da transferência
- [x] Suporte para reversão de operações

## Diferenciais Implementados

- [x] Docker para o backend
- [x] Testes de integração
- [x] Testes unitários
- [x] Documentação completa
- [x] Observabilidade via logs estruturados

## Estrutura de Pastas do Projeto

```
carteira-financeira/
├── backend/                # API Laravel
│   ├── app/
│   │   ├── Http/          # Controllers, Middleware, Requests
│   │   ├── Models/        # Modelos de dados
│   │   └── Services/      # Camada de serviços
│   ├── docker/            # Configurações Docker
│   ├── routes/            # Rotas da API
│   └── tests/             # Testes unitários e de integração
│
└── frontend/              # Aplicação React
    ├── public/            # Arquivos públicos
    └── src/               # Código fonte
        ├── components/    # Componentes React
        ├── contexts/      # Contextos para estado
        ├── hooks/         # Hooks personalizados
        ├── pages/         # Páginas da aplicação
        └── services/      # Serviços para API
```

## Documentação Adicional

- [API Documentation](backend/API_DOCUMENTATION.md) - Documentação completa da API
- [Frontend README](frontend/README.md) - Documentação específica do frontend

## Testes

### Backend
```bash
docker exec carteira-app php artisan test
```

### Frontend
```bash
cd frontend
npm test
```

## Contato

Para mais informações ou suporte, entre em contato pelo email: seu.email@exemplo.com