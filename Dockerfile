FROM ghcr.io/nodejs/node:18

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

