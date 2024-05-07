# Use a Node.js base image
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your Next.js application source code
COPY . .

# Build your Next.js application
RUN npm run build

# Use a Node.js base image for the runtime
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /frontend

# Copy over the built artifacts from the builder stage
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/package.json ./package.json

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
