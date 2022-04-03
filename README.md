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
docker build -t frontend:latest .
docker build \
    --build-arg REACT_APP_NAME=DistNode \
    --build-arg REACT_APP_API_URL=https://dev-api.distnode.com \
    --build-arg REACT_APP_AUTH_URL=https://dev-auth.distnode.com \
    --build-arg REACT_APP_STATIC_URL=https://distnode-static-dev.sfo3.digitaloceanspaces.com \
    -t frontend:<image_tag> .
```
