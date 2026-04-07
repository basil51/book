# Backend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install dependencies (ensure dev deps for build)
RUN pnpm install --frozen-lockfile --prod=false

# Copy shared package
COPY shared ./shared

# Build shared package
RUN pnpm --filter @my-app/shared build

# Copy backend source
COPY backend ./backend

# Ensure backend dev deps are present for build
RUN pnpm --filter backend install --frozen-lockfile --prod=false

# Build backend
RUN pnpm --filter backend build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from base stage
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/shared/package.json ./shared/
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/backend/package.json ./backend/
COPY --from=base /app/backend/uploads ./backend/uploads

WORKDIR /app/backend

EXPOSE 4001

CMD ["node", "dist/src/main.js"]
