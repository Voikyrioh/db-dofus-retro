FROM node:24-alpine AS builder

ARG VITE_API_URL=https://dofus-db-api.voikyrioh.fr
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN --mount=type=secret,id=github_token \
    npm config set @Voikyrioh:registry https://npm.pkg.github.com/ && \
    npm config set //npm.pkg.github.com/:_authToken "$(cat /run/secrets/github_token)" && \
    npm ci

COPY index.html vite.config.ts tsconfig*.json tailwind.config.js postcss.config.js ./
COPY src/ ./src/

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /dist /usr/share/nginx/html
COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
