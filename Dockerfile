FROM node:lts-alpine AS client-builder

WORKDIR /client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM python:3.13-alpine
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"

COPY server/pyproject.toml server/uv.lock ./
RUN uv sync --locked --no-cache --no-dev

COPY server/ ./
COPY --from=client-builder /client/dist /app/static

EXPOSE 8003

CMD ["uv", "run", "fastapi", "run", "main.py", "--port", "8003"]
