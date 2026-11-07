FROM node:24.22.2-bookworm-slim AS frontend
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.13.12-slim-bookworm AS api
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:0.12.13 /uv /uvx /bin/
COPY api/pyproject.toml api/uv.lock ./api/
RUN uv sync --project api --locked --no-dev
COPY api ./api
COPY data ./data
EXPOSE 8000
CMD ["uv", "run", "--project", "api", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
