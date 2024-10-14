ARG PYTHON_VERSION=3.12.2
FROM python:${PYTHON_VERSION}-slim AS base

RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

COPY requirements.txt .

# Download dependencies as a separate step to take advantage of Docker's    caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt --verbose

# Node.js installation
# Node.js installation using NodeSource
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs=22.4.1-1nodesource1

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install cors mssql

COPY . .

# Switch to the non-privileged user to run the application.
USER appuser

EXPOSE 4000

CMD ["npm", "run", "dev"]