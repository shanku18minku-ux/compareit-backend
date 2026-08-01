# Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies if needed for build)
RUN npm ci

# Copy the rest of the application
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Set environment to production to optimize node
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application code from builder
COPY --from=builder /usr/src/app/index.js ./
COPY --from=builder /usr/src/app/routes ./routes
COPY --from=builder /usr/src/app/services ./services
COPY --from=builder /usr/src/app/providers ./providers

# Expose port (Cloud providers often override this via process.env.PORT)
EXPOSE 5000

# Start the server securely (using node instead of npm for better signal handling)
CMD ["node", "index.js"]
