FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Install dependencies needed to compile native modules if required.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client for Linux target and build Next.js app.
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/data/dev.db

# Runtime certificates for external HTTPS calls.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy standalone server and static assets produced by Next.js.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema and optional local SQLite DB (use volume in production).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dev.db ./dev.db
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

VOLUME ["/data"]

EXPOSE 3000

CMD ["/entrypoint.sh"]