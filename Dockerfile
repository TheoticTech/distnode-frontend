# FRONTEND BUILD STAGE
FROM node:17.4.0 as frontend_build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using package.json and package-lock.json
COPY frontend .
RUN npm install
RUN npm run build

# SERVER BUILD STAGE
FROM node:17.4.0 as serve

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using package.json and package-lock.json
COPY package*.json ./
RUN npm ci --only=production
RUN npm install typescript@4.5.5

# Bundle app source
COPY . .

# Copy frontend files
RUN mkdir dist
COPY --from=frontend_build /usr/src/app/build dist/frontend

# Configure app to run in production mode
ENV NODE_ENV=production

# Execute app on port 3002
EXPOSE 3002
CMD [ "npm", "start" ]
