#!/bin/bash

# Define variables
CONTAINER_NAME="nbia_container"
IMAGE_NAME="nbia-image"
#RESULT_DIR="your_result_directory"

# Build Docker image
docker build -t $IMAGE_NAME ../software/

# Run Docker container with the ant build and keep it running
docker run --name $CONTAINER_NAME -v $(pwd)/target:/usr/src/app/target  $IMAGE_NAME ant dist

# Wait for the container to finish
#docker wait $CONTAINER_NAME

# Copy resulting files from container to host
#docker cp $CONTAINER_NAME:/path/to/build/ $RESULT_DIR

# Remove the container
docker rm $CONTAINER_NAME

