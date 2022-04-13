## BUILD stage
FROM node:17.4.0-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Configure REACT_APP environment variables
ARG REACT_APP_NAME=DistNode
ARG REACT_APP_API_URL=https://dev-api.distnode.com
ARG REACT_APP_AUTH_URL=https://dev-auth.distnode.com
ARG REACT_APP_STATIC_URL=https://distnode-static-dev.sfo3.digitaloceanspaces.com

# Generate build artifacts
RUN npm run build

## SERVE stage
FROM nginx:stable

# Copy build artifacts from build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Generate default Nginx configuration using template file
ARG REACT_APP_URL=https://dev.distnode.com
ENV REACT_APP_URL ${REACT_APP_URL}
COPY ./nginx/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
RUN envsubst '${REACT_APP_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Execute app on port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
