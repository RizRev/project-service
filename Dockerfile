FROM node:16.15.0-alpine as build

# Set Working Directory
WORKDIR /app

# Copy Node Packages Requirement
COPY package*.json /app/package.json

#RUN npm config set registry http://registry.npmjs.org

# install depedency
RUN npm install 

# Copy Node Source Code File
COPY . .

RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Remove src directory
RUN rm -rf src

# Expose Application Port
EXPOSE 9000

# Run The Application
CMD ["npm", "start"]
