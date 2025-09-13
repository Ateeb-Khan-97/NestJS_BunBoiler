FROM oven/bun:1 AS deps

WORKDIR /app

COPY tsconfig.json package.json bun.lock ./
COPY ./src ./src
COPY ./scripts ./scripts

RUN bun install --frozen-lockfile --production
RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nest -u 1001

COPY --from=deps --chown=nest:nodejs /app/dist/main.js ./

USER nest

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["bun", "main.js"]