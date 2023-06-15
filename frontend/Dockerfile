# Base image
FROM node:18.16.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
