# Field Report

Ferramenta digital para equipes de ar-condicionado. Do checklist em campo até o relatório final — seja em manutenção preventiva, corretiva, instalação ou inspeção.

Técnicos registram a ordem de serviço, preenchem checklists específicos por tipo de serviço, fazem upload de fotos e ao final geram um relatório completo para o cliente ou gestor.

## Stack

- **Runtime:** Node.js 20 + Express
- **Linguagem:** TypeScript (strict mode)
- **Banco de dados:** PostgreSQL 16 + Drizzle ORM
- **Autenticação:** JWT (access token 15min + refresh token 7d)
- **Validação:** Zod
- **Upload de arquivos:** Cloudinary
- **Testes:** Jest + ts-jest
- **Gerenciador de pacotes:** pnpm workspaces (monorepo)

## Estrutura do Monorepo

```
field-report/
├── apps/
│   ├── backend/          # API REST (Node.js + Express)
│   └── frontend/         # (em desenvolvimento)
├── packages/
│   └── shared/           # Tipos e schemas Zod compartilhados
├── docker-compose.yml
├── .env.example
└── README.md
```

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- pnpm 9+

## Como Rodar

### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd field-report
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example apps/backend/.env
# Edite apps/backend/.env com seus valores reais
```

### 3. Subir o banco de dados

```bash
docker-compose up -d
```

### 4. Rodar as migrations

```bash
pnpm migrate
```

### 5. Rodar o backend em desenvolvimento

```bash
pnpm dev:backend
# ou dentro de apps/backend:
pnpm dev
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `JWT_SECRET` | Segredo para assinar access tokens |
| `JWT_REFRESH_SECRET` | Segredo para assinar refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary |
| `CLOUDINARY_API_KEY` | Chave de API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Segredo de API do Cloudinary |
| `PORT` | Porta do servidor (padrão: 3001) |

## Endpoints da API

### Health
| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status do servidor |

### Auth (públicos)
| Método | Rota | Body | Descrição |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | Registrar usuário |
| POST | `/auth/login` | `{ email, password }` | Login |
| POST | `/auth/refresh` | `{ refreshToken }` | Renovar access token |

### Services (requer JWT)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/services` | Criar serviço + checklist automático |
| GET | `/services` | Listar serviços do usuário |
| GET | `/services/:id` | Detalhe com checklist e fotos |
| PATCH | `/services/:id` | Atualizar serviço |
| DELETE | `/services/:id` | Remover serviço |

### Photos (requer JWT)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/services/:id/photos` | Upload de foto (multipart/form-data) |

### Reports (requer JWT)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/services/:id/report` | Criar relatório |
| GET | `/services/:id/report` | Relatório completo |

## Testes

```bash
pnpm test:backend
```
