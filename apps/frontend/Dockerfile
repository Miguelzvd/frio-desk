# ---- Base: Node + pnpm via corepack ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

# ---- Deps: instala dependências do workspace ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

# ---- Dev: hot reload com Next.js ----
FROM deps AS dev
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["pnpm", "dev"]

# ---- Builder: next build com output standalone ----
FROM deps AS builder
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Prod: imagem mínima com standalone output ----
FROM node:20-alpine AS prod
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/frontend/server.js"]
