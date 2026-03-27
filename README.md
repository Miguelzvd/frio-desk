# FrioDesk

Equipes de manutenção de ar-condicionado enfrentam um problema recorrente: registrar serviços em campo de forma padronizada, sem papel, sem perda de informação e com evidência fotográfica. A comunicação entre técnico e gestor costuma ser informal — mensagens de WhatsApp, anotações avulsas, fotos soltas no celular — o que dificulta rastreabilidade, auditoria e padronização dos processos.

**FrioDesk** resolve isso. É uma ferramenta web mobile-first onde o técnico abre o serviço no celular, preenche o checklist específico para aquele tipo de atendimento, registra fotos do equipamento e finaliza com um relatório estruturado. O gestor acompanha tudo pelo painel administrativo em tempo real, com visão completa de todos os técnicos e atendimentos.

### O que o projeto entrega

- **Para o técnico:** fluxo simples e rápido para registrar qualquer tipo de atendimento (preventiva, corretiva, instalação ou inspeção) diretamente do celular, sem papel
- **Para o gestor:** painel com métricas, histórico completo de serviços, relatórios fotográficos e visão consolidada da equipe
- **Para a empresa:** padronização de processos, rastreabilidade de serviços e evidência documentada de cada atendimento

## Interfaces

O sistema possui duas interfaces independentes:

- **[Técnico](#urls-de-acesso)** — acesso mobile-first para registrar serviços, preencher checklists e fazer upload de fotos em campo
- **[Admin](#urls-de-acesso)** — painel de gestão com métricas, listagem de todos os serviços e visão consolidada da equipe

## Stack

- **Runtime:** Node.js 20 + Express
- **Linguagem:** TypeScript (strict mode)
- **Banco de dados:** PostgreSQL 16 + Drizzle ORM
- **Autenticação:** JWT (access token 15min + refresh token 7d)
- **Validação:** Zod
- **Upload de arquivos:** Cloudinary (ou local em dev)
- **Frontend:** Next.js + Tailwind CSS + TanStack Query
- **Testes:** Jest + ts-jest
- **Gerenciador de pacotes:** pnpm workspaces (monorepo)

## Estrutura do Monorepo

```
friodesk/
├── apps/
│   ├── backend/          # API REST (Node.js + Express)
│   └── frontend/         # Interface web (Next.js)
├── packages/
│   └── shared/           # Tipos e schemas Zod compartilhados
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Como Rodar

### Pré-requisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker + Docker Compose (apenas para o banco)

### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd friodesk
pnpm install
```

### 2. Configurar variáveis de ambiente

**Backend:**

```bash
cp .env.example apps/backend/.env
# Edite apps/backend/.env com seus valores
```

Para desenvolvimento local, o `.env` mínimo funcional é:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/friodesk
JWT_SECRET=qualquer_string_longa_aqui
JWT_REFRESH_SECRET=outra_string_longa_aqui
PORT=3001
APP_URL=http://localhost:3001
STORAGE_PROVIDER=local
```

> `STORAGE_PROVIDER=local` salva uploads na pasta `apps/backend/uploads/` sem precisar de Cloudinary.

**Frontend:**

```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

O arquivo gerado já está correto para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Subir o banco de dados

```bash
docker-compose up -d
```

### 4. Rodar as migrations

```bash
pnpm migrate
```

### 5. Popular o banco com dados de exemplo

```bash
pnpm seed
```

Isso criará:

- 4 usuários (1 admin + 3 técnicos) — senha: `123456`
- 14 serviços (8 finalizados + 6 em aberto)
- Checklists e fotos de exemplo

### 6. Iniciar o backend

```bash
pnpm dev:backend
# API disponível em http://localhost:3001
```

### 7. Iniciar o frontend

```bash
pnpm dev:frontend
# App disponível em http://localhost:3000
```

### URLs de acesso

| Serviço         | URL                               |
| --------------- | --------------------------------- |
| Login (técnico) | http://localhost:3000/login       |
| Login (admin)   | http://localhost:3000/admin/login |
| Backend         | http://localhost:3001             |
| Health          | http://localhost:3001/health      |

---

## Rodando com Docker (tudo containerizado)

Para subir frontend, backend e banco de dados com um único comando:

```bash
cp .env.example .env
# Edite .env com seus valores antes de continuar
docker-compose up --build
```

### URLs de acesso

| Serviço  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:3001        |
| Health   | http://localhost:3001/health |

---

## Credenciais de Acesso (após seed)

Todos os usuários criados pelo seed têm a senha: **`123456`**

| Email                            | Role    | Nome           |
| -------------------------------- | ------- | -------------- |
| `admin@friodesk.com`          | Admin   | Administrador  |
| `joao.silva@friodesk.com`     | Técnico | João Silva     |
| `maria.santos@friodesk.com`   | Técnico | Maria Santos   |
| `pedro.oliveira@friodesk.com` | Técnico | Pedro Oliveira |

---

## Variáveis de Ambiente

### Backend (`apps/backend/.env`)

| Variável                | Obrigatório | Descrição                                         |
| ----------------------- | ----------- | ------------------------------------------------- |
| `DATABASE_URL`          | Sim         | URL de conexão PostgreSQL                         |
| `JWT_SECRET`            | Sim         | Segredo para assinar access tokens                |
| `JWT_REFRESH_SECRET`    | Sim         | Segredo para assinar refresh tokens               |
| `PORT`                  | Não         | Porta do servidor (padrão: `3001`)                |
| `APP_URL`               | Não         | URL base da API (padrão: `http://localhost:3001`) |
| `STORAGE_PROVIDER`      | Não         | `local` (padrão) ou `cloudinary`                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary  | Nome do cloud no Cloudinary                       |
| `CLOUDINARY_API_KEY`    | Cloudinary  | Chave de API do Cloudinary                        |
| `CLOUDINARY_API_SECRET` | Cloudinary  | Segredo de API do Cloudinary                      |

### Frontend (`apps/frontend/.env.local`)

| Variável              | Obrigatório | Descrição               |
| --------------------- | ----------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Sim         | URL base da API backend |

---

## Testes

```bash
pnpm test:backend
```

---

## Endpoints da API

### Health

| Método | Rota      | Descrição          |
| ------ | --------- | ------------------ |
| GET    | `/health` | Status do servidor |

### Auth (públicos)

| Método | Rota             | Body                        | Descrição            |
| ------ | ---------------- | --------------------------- | -------------------- |
| POST   | `/auth/register` | `{ name, email, password }` | Registrar usuário    |
| POST   | `/auth/login`    | `{ email, password }`       | Login                |
| POST   | `/auth/refresh`  | `{ refreshToken }`          | Renovar access token |

### Services (requer JWT)

| Método | Rota                                        | Descrição                                           |
| ------ | ------------------------------------------- | --------------------------------------------------- |
| POST   | `/services`                                 | Criar serviço + checklist automático                |
| GET    | `/services`                                 | Listar serviços (paginado, filtrável por tipo/status) |
| GET    | `/services/metrics`                         | Métricas de serviços do usuário                     |
| GET    | `/services/:id`                             | Detalhe com checklist e fotos                       |
| PATCH  | `/services/:id`                             | Atualizar serviço                                   |
| DELETE | `/services/:id`                             | Remover serviço                                     |
| PATCH  | `/services/:serviceId/checklist/:itemId`    | Marcar/desmarcar item do checklist                  |

### Photos (requer JWT)

| Método | Rota                             | Descrição                            |
| ------ | -------------------------------- | ------------------------------------ |
| GET    | `/services/:id/photos`           | Listar fotos do serviço              |
| POST   | `/services/:id/photos`           | Upload de foto (multipart/form-data) |
| DELETE | `/services/:id/photos/:photoId`  | Remover foto                         |

### Users (requer JWT)

| Método | Rota                    | Descrição                          | Role  |
| ------ | ----------------------- | ---------------------------------- | ----- |
| GET    | `/users/technicians`    | Listar técnicos cadastrados        | —     |
| GET    | `/users`                | Listar todos os usuários           | Admin |
| GET    | `/users/:id`            | Detalhe de um usuário              | Admin |
| GET    | `/users/:id/services`   | Serviços de um usuário             | Admin |
| PATCH  | `/users/:id`            | Atualizar usuário                  | Admin |
| DELETE | `/users/:id`            | Remover usuário                    | Admin |

---

## Fluxo do Técnico

O técnico usa a aplicação em campo, registrando cada atendimento do início ao fim — do checklist até o relatório final.

1. Acessa `/login` com email e senha
2. No dashboard, visualiza todas as suas ordens de serviço (abertas e finalizadas)
3. Cria um novo serviço em `/services/new`, selecionando o tipo do atendimento
4. Um checklist específico é gerado automaticamente conforme o tipo escolhido
5. Durante o atendimento, marca os itens do checklist conforme conclui cada etapa
6. Faz upload das fotos do equipamento diretamente pela tela do serviço
7. Finaliza o serviço quando todas as etapas estiverem concluídas
8. Gera o relatório final, que reúne dados do serviço, checklist, fotos e responsável

## Fluxo do Admin

O administrador tem visão completa da operação, sem interferir nos atendimentos dos técnicos.

1. Acessa `/admin/login` com credenciais de nível admin
2. No dashboard, visualiza métricas gerais: total de serviços, distribuição por tipo e status, total de técnicos
3. Navega pela listagem completa de serviços de todos os técnicos em `/admin/services`
4. Filtra serviços por tipo ou por status conforme necessário
5. Acessa o detalhe de qualquer serviço para ver checklist e fotos (somente leitura)
6. Visualiza o relatório completo de qualquer atendimento
7. Consulta a listagem de técnicos cadastrados em `/admin/technicians`

---

## Formulários e Validações

**Registro**

| Campo | Regra                            |
| ----- | -------------------------------- |
| Nome  | Obrigatório                      |
| Email | Obrigatório, formato válido      |
| Senha | Obrigatório, mínimo 6 caracteres |

**Login**

| Campo | Regra                       |
| ----- | --------------------------- |
| Email | Obrigatório, formato válido |
| Senha | Obrigatório                 |

**Novo serviço**

| Campo       | Regra                                                               |
| ----------- | ------------------------------------------------------------------- |
| Tipo        | Obrigatório — `preventiva`, `corretiva`, `instalação` ou `inspeção` |
| Observações | Opcional                                                            |

**Upload de foto**

| Campo   | Regra                                                   |
| ------- | ------------------------------------------------------- |
| Arquivo | Obrigatório, extensões aceitas: `.jpg`, `.jpeg`, `.png` |

**Relatório**

| Campo       | Regra    |
| ----------- | -------- |
| Observações | Opcional |