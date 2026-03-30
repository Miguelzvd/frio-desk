# ---- Base: Node + pnpm via corepack ----
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

# ---- Deps: instala dependências do workspace ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

# ---- Dev: hot reload com ts-node-dev ----
FROM deps AS dev
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
WORKDIR /app/apps/backend
EXPOSE 3001
CMD ["pnpm", "dev"]

# ---- Builder: compila TypeScript para produção ----
FROM deps AS builder
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
WORKDIR /app/apps/backend
RUN pnpm build

# ---- Prod: imagem mínima sem devDeps ----
FROM base AS prod
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
RUN mkdir -p /app/apps/backend/uploads && chown -R node:node /app/apps/backend
WORKDIR /app/apps/backend
USER node
EXPOSE 3001
CMD ["node", "dist/server.js"]
