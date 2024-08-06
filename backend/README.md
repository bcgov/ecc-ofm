## OFM Backend

The Node.js backend for the OFM application that handles authentication, authorization, and session management.
This project was built using the EDUC-CCOF project as a template.

### Local Setup

**`Step 1`** Make sure you have Node.js installed in your local machine. if not download from here https://nodejs.org/en/

**`Step 2`** Ask for local.json file which contains all the configs from teammate, or create it by following config maps from oc console.

**`Step 3`** Place local.json in src/config.

**`Step 4`** Run `npm install` in command line from backend folder, to install required dependencies.

**`Step 5`** Run `npm run serve` in command line from backend folder, to run the app.

**`Step 6`** Open http://localhost:8080/api/health to verify that the app is running.

### Lint with [ESLint](https://eslint.org/)

With NPM:

```sh
npm run lint
```

To fix issues:

```sh
npm run lint:fix
```

### Unit Tests

Run `npm run test` in command line from backend folder, to execute unit tests.

### Docker

#### Build

```
docker build . -t ofm-backend
```

#### Run

```
docker run -d -p 8082:8080 ofm-backend
```

#### Verify

Open http://localhost:8082/api/health to verify that the app is running.
