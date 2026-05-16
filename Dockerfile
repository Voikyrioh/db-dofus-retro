FROM node:24-alpine AS builder

ARG VITE_API_URL=https://dofus-db-api.voikyrioh.fr
ENV VITE_API_URL=$VITE_API_URL
RUN --mount=type=secret,id=GITHUB_TOKEN \
    echo "machine github.com login x password $(head -n 1 /run/secrets/GITHUB_TOKEN)" > ~/.netrc && \

COPY package*.json .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
