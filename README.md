# FrioDesk

Equipes de manutenção de ar-condicionado enfrentam um problema recorrente: registrar serviços em campo de forma padronizada, sem papel, sem perda de informação e com evidência fotográfica. A comunicação entre técnico e gestor costuma ser informal — mensagens de WhatsApp, anotações avulsas, fotos soltas no celular — o que dificulta rastreabilidade, auditoria e padronização dos processos.

**FrioDesk** resolve isso. É uma ferramenta web mobile-first onde o técnico abre o serviço no celular, preenche o checklist específico para aquele tipo de atendimento, registra fotos do equipamento e finaliza com um relatório estruturado. O gestor acompanha tudo pelo painel administrativo em tempo real, com visão completa de todos os técnicos e atendimentos.

### O que o projeto entrega

- **Para o técnico:** fluxo simples e rápido para registrar qualquer tipo de atendimento (preventiva, corretiva, instalação ou inspeção) diretamente do celular, sem papel
- **Para o gestor:** painel com métricas filtráveis por mês e ano, histórico completo de serviços, exportação de relatórios CSV e gerenciamento completo da equipe de técnicos
- **Para a empresa:** padronização de processos, rastreabilidade de serviços e evidência documentada de cada atendimento

## Interfaces

O sistema possui duas interfaces independentes:

- **[Técnico](#urls-de-acesso)** — acesso mobile-first para registrar serviços, preencher checklists e fazer upload de fotos em campo
- **[Admin](#urls-de-acesso)** — painel de gestão com métricas filtráveis por mês/ano, listagem de todos os serviços, exportação CSV e gerenciamento de técnicos

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
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml       # prod: backend + postgres
│   │   ├── docker-compose.dev.yml   # dev: backend + postgres + hot reload
│   │   └── .env.example
│   └── frontend/
│       ├── Dockerfile
│       ├── docker-compose.yml       # prod: next.js standalone
│       ├── docker-compose.dev.yml   # dev: next.js + hot reload
│       └── .env.example
├── packages/
│   └── shared/           # Tipos e schemas Zod compartilhados
├── docker-compose.yml    # postgres standalone (para dev local sem Docker no app)
├── .env.example
└── README.md
```

---

## Como Rodar

### Pré-requisitos

- Node.js 20+
- pnpm 10+ (`npm install -g pnpm`)
- Docker + Docker Compose

---

### Opção A — Local (sem Docker no app)

Útil para desenvolvimento com hot reload nativo e debugging direto.

#### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd friodesk
pnpm install
```

#### 2. Configurar variáveis de ambiente

**Backend:**

```bash
cp apps/backend/.env.example apps/backend/.env
# Edite apps/backend/.env com seus valores
```

`.env` mínimo funcional:

```env
# Banco de dados — em dev, "postgres" resolve via nome do serviço Docker
DATABASE_URL=postgresql://user:password@postgres:5432/friodesk

# Autenticação — substituir por strings longas e aleatórias
JWT_SECRET=changeme
JWT_REFRESH_SECRET=changeme

# Servidor
PORT=3001
APP_URL=http://localhost:3001

# Storage: "local" (volume Docker) ou "cloudinary"
STORAGE_PROVIDER=local

# PostgreSQL — usado pelo docker-compose.yml de produção
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=friodesk

```

> `STORAGE_PROVIDER=local` salva uploads na pasta `apps/backend/uploads/` sem precisar de Cloudinary.

**Frontend:**

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

O arquivo gerado já está correto para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. Subir o banco de dados

```bash
docker compose up -d
```

#### 4. Rodar as migrations

```bash
cd apps/backend && pnpm migrate
```

#### 5. Popular o banco com dados de exemplo

```bash
cd apps/backend && pnpm seed
```

Isso criará:

- 4 usuários (1 admin + 3 técnicos) — senha: `123456`
- 14 serviços (8 finalizados + 6 em aberto)
- Checklists e fotos de exemplo

#### 6. Iniciar o backend

```bash
pnpm dev:backend
# API disponível em http://localhost:3001
```

#### 7. Iniciar o frontend

```bash
pnpm dev:frontend
# App disponível em http://localhost:3000
```

---

### Opção B — Docker (tudo containerizado)

Frontend e backend são **independentes** — cada um tem seu próprio compose. Isso permite subir apenas o que precisar.

#### Backend + Banco de Dados

```bash
cd apps/backend
cp .env.example .env
# Edite .env: substitua JWT_SECRET, JWT_REFRESH_SECRET por strings seguras
# Garanta que DATABASE_URL usa "postgres" como host (não "localhost"):
# DATABASE_URL=postgresql://user:password@postgres:5432/friodesk

# Dev (com hot reload)
docker compose -f docker-compose.dev.yml up --build

# Produção
docker compose up --build -d
```

#### Migrations e Seed (manual, quando necessário)

```bash
# Dev
docker compose -f docker-compose.dev.yml exec backend pnpm migrate
docker compose -f docker-compose.dev.yml exec backend pnpm seed

# Prod
docker compose exec backend pnpm migrate
```

#### Frontend

```bash
cd apps/frontend
cp .env.example .env
# Edite .env: defina NEXT_PUBLIC_API_URL com a URL do backend

# Dev (com hot reload)
docker compose -f docker-compose.dev.yml up --build

# Produção
docker compose up --build -d
```

> **Nota macOS/Windows:** o hot reload do frontend usa `WATCHPACK_POLLING=1` automaticamente no compose dev — não é necessário nenhuma configuração adicional.

---

### URLs de acesso

| Serviço         | URL                               |
| --------------- | --------------------------------- |
| Login (técnico) | http://localhost:3000/login       |
| Login (admin)   | http://localhost:3000/admin/login |
| Backend         | http://localhost:3001             |
| Health          | http://localhost:3001/health      |

---

## Credenciais de Acesso (após seed)

Todos os usuários criados pelo seed têm a senha: **`123456`**

| Email                            | Role    | Nome           |
| -------------------------------- | ------- | -------------- |
| `admin@friodesk.com`             | Admin   | Administrador  |
| `joao.silva@friodesk.com`        | Técnico | João Silva     |
| `maria.santos@friodesk.com`      | Técnico | Maria Santos   |
| `pedro.oliveira@friodesk.com`    | Técnico | Pedro Oliveira |

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
| `POSTGRES_USER`         | Docker      | Usuário do PostgreSQL (compose prod)              |
| `POSTGRES_PASSWORD`     | Docker      | Senha do PostgreSQL (compose prod)                |
| `POSTGRES_DB`           | Docker      | Nome do banco (compose prod)                      |

### Frontend (`apps/frontend/.env` ou `.env.local`)

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

| Método | Rota                                     | Descrição                                            |
| ------ | ---------------------------------------- | ---------------------------------------------------- |
| POST   | `/services`                              | Criar serviço + checklist automático                 |
| GET    | `/services`                              | Listar serviços (paginado, filtrável por tipo/status) |
| GET    | `/services/metrics`                      | Métricas de serviços do usuário                      |
| GET    | `/services/:id`                          | Detalhe com checklist e fotos                        |
| PATCH  | `/services/:id`                          | Atualizar serviço                                    |
| DELETE | `/services/:id`                          | Remover serviço                                      |
| PATCH  | `/services/:serviceId/checklist/:itemId` | Marcar/desmarcar item do checklist                   |

### Photos (requer JWT)

| Método | Rota                            | Descrição                            |
| ------ | ------------------------------- | ------------------------------------ |
| GET    | `/services/:id/photos`          | Listar fotos do serviço              |
| POST   | `/services/:id/photos`          | Upload de foto (multipart/form-data) |
| DELETE | `/services/:id/photos/:photoId` | Remover foto                         |

### Admin — Serviços (requer JWT + role Admin)

| Método | Rota                      | Query params           | Descrição                                          |
| ------ | ------------------------- | ---------------------- | -------------------------------------------------- |
| GET    | `/services/admin`         | `type`, `status`, `page` | Listar todos os serviços de todos os técnicos    |
| GET    | `/services/admin/metrics` | `year`, `month`        | Métricas gerais filtráveis por mês e ano           |
| GET    | `/services/report`        | `type`, `status`       | Exportar serviços como CSV (download automático)   |

### Admin — Usuários (requer JWT + role Admin)

| Método | Rota                  | Descrição                                       |
| ------ | --------------------- | ----------------------------------------------- |
| GET    | `/users`              | Listar todos os usuários                        |
| GET    | `/users/technicians`  | Listar técnicos cadastrados                     |
| GET    | `/users/:id`          | Detalhe de um usuário                           |
| GET    | `/users/:id/services` | Serviços de um usuário                          |
| POST   | `/users`              | Criar novo técnico (nome, email, senha)         |
| PATCH  | `/users/:id`          | Atualizar nome e email de um técnico            |
| DELETE | `/users/:id`          | Remover usuário                                 |

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

O administrador tem visão completa da operação e controle total sobre a equipe de técnicos.

1. Acessa `/admin/login` com credenciais de nível admin
2. No dashboard, visualiza métricas gerais: total de serviços, serviços em andamento, concluídos, total de técnicos ativos — além de dois gráficos (serviços por tipo e distribuição de status)
3. Filtra as métricas do dashboard por **ano e mês** usando dois seletores dropdown — ao selecionar um ano, o mês é ajustado automaticamente para o primeiro disponível naquele ano
4. Navega pela listagem completa de serviços de todos os técnicos em `/admin/services`
5. Filtra serviços por **tipo** (preventiva, corretiva, instalação, inspeção) ou por **status** (aberto, finalizado) através de dropdowns na página
6. Exporta a listagem como **arquivo CSV** clicando em "Exportar Relatório" — os filtros de tipo e status ativos são aplicados na exportação. O arquivo gerado inclui: técnico, e-mail, tipo, status, data de abertura e data de conclusão
7. Acessa o detalhe de qualquer serviço para ver checklist e fotos (somente leitura)
8. Em `/admin/technicians`, visualiza a equipe cadastrada e gerencia técnicos:
   - **Criar:** clica em "Adicionar Técnico", preenche nome, e-mail e senha em um modal e confirma com "Cadastrar Técnico"
   - **Editar:** clica na ação da linha na tabela, edita nome e e-mail no modal (senha não é alterável por aqui) e confirma com "Salvar Alterações"

---

## Formulários e Validações

**Registro / Criação de técnico (admin)**

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

**Edição de técnico (admin)**

| Campo | Regra                                        |
| ----- | -------------------------------------------- |
| Nome  | Obrigatório, mínimo 2 caracteres             |
| Email | Obrigatório, formato válido                  |

> Senha não é editável pelo modal de edição.

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

**Filtro de métricas (admin dashboard)**

| Campo | Comportamento                                                                 |
| ----- | ----------------------------------------------------------------------------- |
| Ano   | Dropdown com anos que possuem serviços registrados, ordenado do mais recente  |
| Mês   | Dropdown com meses disponíveis no ano selecionado (nomes em português)        |

> Ao selecionar um ano, o mês é automaticamente ajustado para o primeiro disponível naquele ano.
