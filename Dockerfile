# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app
ENV PORT=4000
# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install

EXPOSE 4000 
# Define the entry point for the container
CMD ["node", "index"]