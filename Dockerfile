FROM node:24-alpine AS builder

ARG VITE_API_URL=https://dofus-db-api.voikyrioh.fr
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN --mount=type=secret,id=GITHUB_TOKEN \
    echo "@Voikyrioh:registry=https://npm.pkg.github.com \
//npm.pkg.github.com/:_authToken=$(head -n 1 /run/secrets/GITHUB_TOKEN)" > ~/.npmrc

RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
