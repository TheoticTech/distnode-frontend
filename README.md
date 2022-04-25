# Getting Started

## Installation
```sh
npm i
```
## Running in Development
```sh
npm start
```

## Running Tests
```sh
npm test
```

## Generating Build Artifacts
```sh
npm run build
```

# Docker builds

## Using Defaults
```sh
docker build -t frontend:latest .
```

## Using Available Build Arguments
```sh
docker build \
    --build-arg REACT_APP_NAME=DistNode \
    --build-arg REACT_APP_URL=localhost:3002 \
    --build-arg REACT_APP_API_URL=localhost:3001 \
    --build-arg REACT_APP_AUTH_URL=localhost:3000 \
    --build-arg REACT_APP_STATIC_URL=https://distnode-static-dev.sfo3.digitaloceanspaces.com \
    --build-arg REACT_APP_GA_TAG=G-GXWKXCJ2TT \
    -t frontend:latest .
```
