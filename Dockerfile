# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# ── Dependencias ──────────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/gestion-tickets/package.json ./apps/gestion-tickets/
COPY apps/asignacion-tecnicos/package.json ./apps/asignacion-tecnicos/
COPY apps/coordinador-solicitudes/package.json ./apps/coordinador-solicitudes/
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM deps AS build
ARG APP_FILTER
COPY packages/shared-types ./packages/shared-types
COPY apps ./apps
RUN pnpm --filter @sistema-tickets/shared-types build \
 && pnpm --filter "${APP_FILTER}" build

# ── Imagen final ──────────────────────────────────────────────────────────────
FROM base AS runner
ARG APP_DIR
ARG APP_PORT=3000
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/packages/shared-types ./packages/shared-types
COPY --from=build /app/apps/${APP_DIR} ./apps/${APP_DIR}

WORKDIR /app/apps/${APP_DIR}
EXPOSE ${APP_PORT}

CMD ["node", "dist/main.js"]
