# ---------------------------------------------------------------------------- #
#                                  BASE IMAGE                                  #
# ---------------------------------------------------------------------------- #
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Skip the postinstall script of Prisma (avoid infinite postinstall loop)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV HUSKY=0
# Use pnpm
RUN corepack enable

# ---------------------------------------------------------------------------- #
#                                  BUILD IMAGE                                 #
# ---------------------------------------------------------------------------- #
FROM base AS build
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build libs in cjs
RUN pnpm run --filter "./packages/**" -r build:cjs

# RUN pnpm deploy --filter=client /prod/client
RUN pnpm deploy --filter=server /prod/server

# ---------------------------------------------------------------------------- #
#                                    SERVER                                    #
# ---------------------------------------------------------------------------- #
FROM base AS server
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssh-server
# Generate Prisma Client
RUN pnpm run db:generate
RUN pnpm run build
# Use the production environment file
# RUN mv .env.prod .env
EXPOSE 5600