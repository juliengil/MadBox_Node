#!/bin/sh

# variables declaration
IMAGE_NAME='node_scraper'
IMAGE_TAG='0.1'
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME='node_scraper'

# check if docker container from image already exist, and delete it if it does
CONTAINER_ID=$(docker ps -a -f 'ancestor=node_scraper:0.1' -q)
[[ ! -z "$CONTAINER_ID" ]] && echo "Delete previous container:" && docker rm -f $CONTAINER_ID

# check if docker image already exist, and delete it if it does
IMAGE_ID=$(docker images $IMAGE --format "{{.ID}}")
[[ ! -z "$IMAGE_ID" ]] && echo "Deleting previous image ${IMAGE}..." && docker rmi -f $IMAGE_ID 1> /dev/null && echo "Done !"

echo "Building the image..."
docker build -q -t $IMAGE . && echo "Done !"
echo "Running the container..."
docker run -d --name "${CONTAINER_NAME}" $IMAGE && echo "Done !"

echo "\nRESULT :"
docker logs -f "${CONTAINER_NAME}"


