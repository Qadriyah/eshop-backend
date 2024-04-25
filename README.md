# eShop API

eShop is an e-commerce tool used to sell goods online

This repo holds code for eShop API

## Table of contents

- [Tools](#tools)
- [Setup](#setup)
- [To install dependencies run](#to-install-dependencies-run)
- [Set environment variables](#set-environment-variables)
- [Running tests](#running-tests)
- [Starting local development server](#starting-local-development-server)

## Tools

- [Node](https://nodejs.org/docs/latest/api/) - A Javascript runtime environment.
- [Nest](https://docs.nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [NPM](https://www.npmjs.com/) - A package manager

## Setup

Clone the repository:

```
git clone https://github.com/Qadriyah/eshop-backend.git
```

Then change to project directory:

```
cd eshop-backend
```

#### To install dependencies run:

```
npm install
```

This will install all the dependencies defined in the `package.json` file inside the eshop-backend folder.

#### Set environment variables

Be sure to set the environment variables shown in the `.env.example` file

### Running tests

TODO

### Starting local development server

#### With docker

- Install `docker-compose` [Guidelines](https://docs.docker.com/compose/install/)
  Once the installation is complete, run the following command to build the application with docker

```
docker-compose up dev --build
```

#### Without docker

```
npm run start:dev
```

After starting the local development server, application can be accessed at the PORT specified in the .env file

```
localhost:PORT
```
