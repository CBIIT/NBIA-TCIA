# Use an official Java 8 runtime as a base image
FROM openjdk:8-jdk-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Node.js and npm
RUN apk add --no-cache nodejs npm
RUN npm install -g @angular/cli@latest


# Install Apache Ant
RUN apk add --no-cache apache-ant

# Copy the Ant build file and source code into the container
COPY . .

WORKDIR /usr/src/app/build

# Specify the command to run on container startup (if needed)
# CMD ["java", "-jar", "your-java-application.jar"]

