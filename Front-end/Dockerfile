FROM node:22.4.1 AS base

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

COPY package*.json ./

RUN npm i

# Copy source code into the container
COPY . .

# Change ownership of node_modules to the appuser
RUN chown -R appuser:appuser /app/node_modules
RUN mkdir -p /app/node_modules/.cache && chown -R appuser:appuser /app/node_modules/.cache

# Switch to the non-privileged user to run the application.
USER appuser

EXPOSE 3000

CMD ["npm", "start"]