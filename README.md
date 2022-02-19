# Getting Started
This consists of two parts, the first being the frontend static React app and the second being the backend Express app.
The backend app will serve any static files found the dist/frontend folder.

When building the [Dockerfile](./Dockerfile) image, the frontend static files will be built and copied to the final image.

## Frontend
### Installation
```sh
cd frontend
npm i
```
### Running in Development
```sh
cd frontend
npm start
```

### Running Tests
```sh
cd frontend
npm run test
```

### Generating Static Files for Backend
```sh
cd frontend
npm run build
```

## Backend
The backend app expects the frontend static files to be found in the dist/frontend folder.
### Installation
```sh
cd frontend
npm i
```
### Running in Development
```sh
cd frontend
npm start
```

### Running Tests
```sh
cd frontend
npm run test
```

## [Helpful Examples](./rest/frontend.rest)
