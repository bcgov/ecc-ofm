## OFM Backend

The Node.js backend for the OFN application that handles authentication, authorization, and session management.
This project was built using the EDUC-CCOF project as a template.  
You may see references to the EDUC-CCOF project until we get this properly cleaned up.

### Local Setup

**`Step 1`** Make sure you have Node.js installed in your local machine. if not download from here https://nodejs.org/en/

**`Step 2`** Ask for local.json file which contains all the configs from teammate, or create it by following config maps from oc console.

**`Step 3`** Place local.json in src/config.

**`Step 4`** Run `npm install` (or `yarn`) in command line from backend folder, to install required dependencies.

**`Step 5`** Run `npm run serve` (or `yarn serve`) in command line from backend folder, to run the app.

**`Step 6`** Open http://localhost:8080/api/health to verify that the app is running.

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
