FROM node:24-alpine

WORKDIR /app

# Copy the package.json and package-lock.json first (for caching optimization)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]