## BUILD stage
FROM node:17.4.0-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Generate build artifacts
RUN npm run build

## SERVE stage
FROM nginx:stable-alpine

# Copy build artifacts from build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Execute app on port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
