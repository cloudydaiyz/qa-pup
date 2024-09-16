FROM mcr.microsoft.com/playwright:v1.47.1

WORKDIR /app

COPY package-lock.json ./
COPY package.json ./
COPY playwright.config.ts ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/check_env.sh ./scripts/check_env.sh
COPY scripts/entrypoint.sh ./scripts/entrypoint.sh

RUN apt-get update && apt-get install -y bash
RUN npm ci
RUN npm run build

RUN chmod +x ./scripts/entrypoint.sh

CMD ["./scripts/entrypoint.sh"]