# Base image
FROM node:18.16.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm i -g react-scripts
RUN npm ci --only=production

# Copy project files
COPY . .

# Install project dependencies
COPY .env.example .env

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]