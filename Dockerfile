FROM node:18 AS development

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install glob rimraf
RUN npm install -g @nestjs/cli
RUN npm install --only=development

COPY . .

# RUN npm run build

FROM node:18 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3001
CMD [ "npm", "start:prod" ]
USER node