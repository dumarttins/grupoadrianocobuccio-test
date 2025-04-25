# Documentação da API - Carteira Financeira

Esta documentação descreve as APIs disponíveis para o sistema de carteira financeira.

## Base URL

```
http://localhost:8000/api
```

## Autenticação

A API utiliza autenticação Bearer Token. Após fazer login ou registrar, você receberá um token que deve ser enviado no header de todas as requisições autenticadas:

```
Authorization: Bearer {seu-token-aqui}
```

## Endpoints

### Autenticação

#### Registrar Usuário

- **URL**: `/register`
- **Método**: `POST`
- **Autenticação**: Não
- **Parâmetros**:
  - `name` (string, obrigatório): Nome completo do usuário
  - `email` (string, obrigatório): Email único do usuário
  - `cpf` (string, obrigatório): CPF do usuário no formato XXX.XXX.XXX-XX
  - `password` (string, obrigatório): Senha do usuário
  - `password_confirmation` (string, obrigatório): Confirmação da senha

- **Resposta de Sucesso**:
  - **Código**: 201
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Usuário registrado com sucesso",
      "user": {
        "id": 1,
        "name": "Nome Exemplo",
        "email": "email@exemplo.com",
        "cpf": "123.456.789-00"
      },
      "wallet": {
        "id": 1,
        "account_number": "1234567890",
        "balance": 0
      },
      "token": "token_de_acesso"
    }
    ```

#### Login

- **URL**: `/login`
- **Método**: `POST`
- **Autenticação**: Não
- **Parâmetros**:
  - `email` (string, obrigatório): Email do usuário
  - `password` (string, obrigatório): Senha do usuário

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Login realizado com sucesso",
      "user": {
        "id": 1,
        "name": "Nome Exemplo",
        "email": "email@exemplo.com"
      },
      "token": "token_de_acesso"
    }
    ```

#### Logout

- **URL**: `/logout`
- **Método**: `POST`
- **Autenticação**: Sim
- **Parâmetros**: Nenhum

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Logout realizado com sucesso"
    }
    ```

#### Obter Usuário Atual

- **URL**: `/user`
- **Método**: `GET`
- **Autenticação**: Sim
- **Parâmetros**: Nenhum

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "user": {
        "id": 1,
        "name": "Nome Exemplo",
        "email": "email@exemplo.com",
        "cpf": "123.456.789-00",
        "wallet": {
          "id": 1,
          "account_number": "1234567890",
          "balance": 100.50
        }
      }
    }
    ```

### Carteira

#### Obter Saldo

- **URL**: `/wallet/balance`
- **Método**: `GET`
- **Autenticação**: Sim
- **Parâmetros**: Nenhum

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "wallet": {
        "id": 1,
        "balance": 100.50,
        "account_number": "1234567890"
      }
    }
    ```

#### Realizar Depósito

- **URL**: `/wallet/deposit`
- **Método**: `POST`
- **Autenticação**: Sim
- **Parâmetros**:
  - `amount` (numeric, obrigatório): Valor a ser depositado
  - `description` (string, opcional): Descrição do depósito

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Depósito realizado com sucesso",
      "transaction": {
        "id": 1,
        "type": "deposit",
        "amount": 100.00,
        "previous_balance": 0.00,
        "new_balance": 100.00,
        "description": "Depósito inicial",
        "transaction_code": "uuid-único"
      },
      "new_balance": 100.00
    }
    ```

#### Realizar Transferência

- **URL**: `/wallet/transfer`
- **Método**: `POST`
- **Autenticação**: Sim
- **Parâmetros**:
  - `receiver_account` (string, obrigatório): Número da conta do destinatário
  - `amount` (numeric, obrigatório): Valor a ser transferido
  - `description` (string, opcional): Descrição da transferência

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Transferência realizada com sucesso",
      "transactions": {
        "out": {
          "id": 2,
          "type": "transfer_out",
          "amount": 50.00,
          "previous_balance": 100.00,
          "new_balance": 50.00,
          "description": "Transferência enviada",
          "transaction_code": "uuid-único",
          "sender_id": 1,
          "receiver_id": 2
        },
        "in": {
          "id": 3,
          "type": "transfer_in",
          "amount": 50.00,
          "previous_balance": 0.00,
          "new_balance": 50.00,
          "description": "Transferência recebida",
          "transaction_code": "uuid-único",
          "sender_id": 1,
          "receiver_id": 2
        }
      },
      "new_balance": 50.00
    }
    ```

#### Listar Transações

- **URL**: `/wallet/transactions`
- **Método**: `GET`
- **Autenticação**: Sim
- **Parâmetros Query String (opcionais)**:
  - `page` (integer): Página para paginação

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "transactions": {
        "current_page": 1,
        "data": [
          {
            "id": 4,
            "type": "deposit",
            "amount": 100.00,
            "previous_balance": 50.00,
            "new_balance": 150.00,
            "description": "Depósito adicional",
            "transaction_code": "uuid-único",
            "created_at": "2023-01-01T12:00:00Z"
          },
          {
            "id": 3,
            "type": "transfer_in",
            "amount": 50.00,
            "previous_balance": 0.00,
            "new_balance": 50.00,
            "description": "Transferência recebida",
            "transaction_code": "uuid-único",
            "created_at": "2023-01-01T11:30:00Z"
          }
        ],
        "per_page": 15,
        "total": 4
      }
    }
    ```

#### Reverter Transação

- **URL**: `/wallet/transactions/{transactionId}/reverse`
- **Método**: `POST`
- **Autenticação**: Sim
- **Parâmetros URL**:
  - `transactionId` (integer, obrigatório): ID da transação a ser revertida
- **Parâmetros Body**:
  - `description` (string, opcional): Descrição da reversão

- **Resposta de Sucesso**:
  - **Código**: 200
  - **Conteúdo**:
    ```json
    {
      "status": "success",
      "message": "Transação revertida com sucesso",
      "reversals": {
        "reversal": {
          "id": 5,
          "type": "reversal",
          "amount": 100.00,
          "previous_balance": 150.00,
          "new_balance": 50.00,
          "description": "Estorno solicitado pelo usuário",
          "transaction_code": "uuid-único",
          "related_transaction_id": 4
        }
      },
      "new_balance": 50.00
    }
    ```

## Códigos de Erro

- **400 Bad Request**: Erro de validação ou lógica de negócio
- **401 Unauthorized**: Token inválido ou expirado
- **404 Not Found**: Recurso não encontrado
- **429 Too Many Requests**: Limite de requisições excedido
- **500 Internal Server Error**: Erro interno do servidor

## Requisitos para Desenvolvimento Local

- PHP >= 8.1
- Composer
- MySQL >= 8.0
- Docker e Docker Compose (opcional, para ambiente containerizado)

## Configuração com Docker

1. Clone o repositório
2. Configure o arquivo `.env` com as credenciais do banco de dados
3. Execute `docker-compose up -d`
4. Acesse a API em `http://localhost:8000/api`

---

Para mais informações sobre o uso da API ou desenvolvimento, entre em contato com a equipe técnica.