FROM node:24-alpine AS builder

ARG VITE_API_URL=https://dofus-db-api.voikyrioh.fr
ENV VITE_API_URL=$VITE_API_URL

ARG GITHUB_TOKEN
COPY package*.json ./
RUN npm config set @Voikyrioh:registry https://npm.pkg.github.com/ && \
    npm config set //npm.pkg.github.com/:_authToken "${GITHUB_TOKEN}" && \
    npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
