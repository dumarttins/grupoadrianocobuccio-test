# Carteira Financeira - Desafio Full Stack

Este projeto consiste em uma API para um sistema de carteira financeira, onde os usuários podem realizar transferências e depósitos de dinheiro, com suporte para reversão de operações.

## Tecnologias Utilizadas

- **PHP 8.2** - Linguagem de programação
- **Laravel 10** - Framework PHP
- **MySQL 8.0** - Banco de dados relacional
- **Docker** - Containerização
- **Nginx** - Servidor web
- **Laravel Sanctum** - Autenticação API

## Requisitos do Sistema

- Docker e Docker Compose instalados
- Git
- Portas 8000 (web) e 3306 (MySQL) disponíveis

## Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/carteira-financeira.git
cd carteira-financeira
```

### 2. Configuração do Ambiente

Copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env
```

Configure o arquivo `.env` com suas credenciais de banco de dados:

```
DB_DATABASE=carteira
DB_USERNAME=carteira_user
DB_PASSWORD=seu_password_seguro
DB_ROOT_PASSWORD=seu_root_password_seguro
```

### 3. Instalar Dependências

```bash
docker run --rm -v $(pwd):/var/www composer install
```

### 4. Iniciar Containers Docker

```bash
docker-compose up -d
```

### 5. Gerar Chave da Aplicação

```bash
docker exec carteira-app php artisan key:generate
```

### 6. Executar Migrações

```bash
docker exec carteira-app php artisan migrate --seed
```

## Estrutura do Projeto

O projeto segue a arquitetura MVC do Laravel com a adição de uma camada de serviço:

- **`app/Models`**: Modelos de domínio (User, Wallet, Transaction)
- **`app/Http/Controllers/API`**: Controllers para API
- **`app/Services`**: Camada de serviços (lógica de negócios)
- **`app/Http/Requests`**: Classes de validação de requisições
- **`app/Http/Resources`**: Transformadores de resposta
- **`app/Http/Middleware`**: Middlewares personalizados
- **`database/migrations`**: Migrações do banco de dados
- **`tests`**: Testes unitários e de integração
- **`docker`**: Configurações de containers

## Funcionalidades Implementadas

1. **Autenticação**
   - Registro de usuários
   - Login/Logout
   - Autenticação via tokens

2. **Carteira Financeira**
   - Visualização de saldo
   - Depósito de valores
   - Transferências entre carteiras
   - Listagem de transações
   - Reversão de operações

3. **Segurança**
   - Validação de dados de entrada
   - Proteção contra CSRF
   - Autenticação via tokens
   - Headers de segurança
   - Proteção contra rate limiting
   - Transações em banco de dados para consistência

4. **Padrões e Boas Práticas**
   - SOLID
   - Design Patterns (Repository, Service Layer)
   - Testes automatizados
   - Documentação da API
   - Observabilidade via logs

## Testes

Para executar os testes:

```bash
docker exec carteira-app php artisan test
```

## Documentação da API

A documentação completa da API está disponível em formato Markdown no arquivo [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Diferenciais Implementados

- [x] Uso de Docker
- [x] Testes de integração
- [x] Testes unitários
- [x] Documentação
- [x] Observabilidade (logs estruturados)

## Acessando a Aplicação

- Backend API: http://localhost:8000/api

## Próximos Passos

1. Desenvolvimento do Frontend em React
2. Implementação de filas para processamento assíncrono de transações
3. Adição de relatórios financeiros
4. Implementação de notificações em tempo real

---

## Contato

Para mais informações ou suporte, entre em contato pelo email: seu.email@exemplo.com