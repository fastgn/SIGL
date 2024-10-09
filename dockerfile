# ---------------------------------------------------------------------------- #
#                                  BASE IMAGE                                  #
# ---------------------------------------------------------------------------- #
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Skip the postinstall script of Prisma (avoid infinite postinstall loop)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
# Use pnpm
RUN corepack enable

# ---------------------------------------------------------------------------- #
#                                  BUILD IMAGE                                 #
# ---------------------------------------------------------------------------- #
FROM base AS build
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build libs
# RUN pnpm run --filter "./packages/**" -r build

# RUN pnpm deploy --filter=client /prod/client
RUN pnpm deploy --filter=server /prod/server

# ---------------------------------------------------------------------------- #
#                                    SERVER                                    #
# ---------------------------------------------------------------------------- #
FROM base AS server
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
# Use the production environment file
# RUN mv .env.prod .env
# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssh-server
EXPOSE 5600
# Generate Prisma Client
RUN pnpm run db:generate
# Build the app
RUN pnpm run build

# ---------------------------------------------------------------------------- #
#                                    CLIENT                                    #
# ---------------------------------------------------------------------------- #
# FROM base AS client
# COPY --from=build /prod/client /prod/client
# WORKDIR /prod/client
# # Use the production environment file
# # RUN mv .env.prod .env
# EXPOSE 3000
# # Build the app
# # RUN pnpm run build