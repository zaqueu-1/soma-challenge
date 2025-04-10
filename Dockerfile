# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build app (with --no-lint to skip linting during build)
RUN npm run build --no-lint

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"] 