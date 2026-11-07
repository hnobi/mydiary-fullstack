# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# Dependencies + source for running the test suite
FROM base AS test
RUN npm ci --no-audit --no-fund
COPY . .
ENV NODE_ENV=test
CMD ["npm", "test"]

# Production image: runtime dependencies only, runs as the unprivileged node user
FROM base AS production
ENV NODE_ENV=production
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY src ./src
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD wget -qO- http://localhost:3000/health || exit 1
# Create missing tables, then start the API
CMD ["sh", "-c", "node src/models/migrate.js && node src/index.js"]
