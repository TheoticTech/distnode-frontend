## BUILD stage
FROM node:17.4.0-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Configure API and AUTH URL endpoints
ARG REACT_APP_API_URL=https://dev-api.distnode.com
ARG REACT_APP_AUTH_URL=https://dev-auth.distnode.com

# Generate build artifacts
RUN npm run build

## SERVE stage
FROM nginx:stable-alpine

# Copy build artifacts from build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy nginx configuration from project files
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Execute app on port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
