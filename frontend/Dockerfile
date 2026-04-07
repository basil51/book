# Frontend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy shared package
COPY shared ./shared

# Build shared package
RUN pnpm --filter @my-app/shared build

# Copy frontend source
COPY frontend ./frontend

# Build frontend
RUN pnpm --filter frontend build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/

# Copy built files and node_modules from base stage
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/shared/package.json ./shared/
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/public ./frontend/public
COPY --from=base /app/frontend/package.json ./frontend/
COPY --from=base /app/frontend/next.config.ts ./frontend/
COPY --from=base /app/frontend/node_modules ./frontend/node_modules
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/shared/node_modules ./shared/node_modules

WORKDIR /app/frontend

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
