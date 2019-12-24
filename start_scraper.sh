#!/bin/sh

# variables declaration
IMAGE_NAME='node_scraper'
IMAGE_TAG='0.1'
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME='node_scraper'

# usage logging function
usage() {
  echo "Usage: $0 [-r: rebuild a new image]" 1>&2; exit 1;
}

# delete the container if it already exists
delete_container() {
    # check if docker container from image already exist, and delete it if it does
    CONTAINER_ID=$(docker ps -a -f 'ancestor=node_scraper:0.1' -q)
    [[ ! -z "$CONTAINER_ID" ]] && echo "Delete previous container:" && docker rm -f $CONTAINER_ID
}

# run the container from the image
run_container() {
    echo "Running the container..."
    docker run -d --name "${CONTAINER_NAME}" $IMAGE && echo "Done !"
}

# delete the image if it already exists
delete_image() {
    # check if docker image already exist, and delete it if it does
    IMAGE_ID=$(docker images $IMAGE --format "{{.ID}}")
    [[ ! -z "$IMAGE_ID" ]] && echo "Deleting previous image ${IMAGE}..." && docker rmi -f $IMAGE_ID 1> /dev/null && echo "Done !"
}

# build the image
build_image() {
    echo "Building the image..."
    docker build -q -t $IMAGE . && echo "Done !"
}

docker_logs() {
    echo "\nRESULT :"
    docker logs -f "${CONTAINER_NAME}"
}

# if arguments provided
if [[ ! $# -eq 0 ]]
  then while getopts ":r" opt; do
    case $opt in
      r)
        delete_container
        delete_image
        build_image
        ;;
      *)
        usage
        ;;
    esac
  done
else
    delete_container
fi

run_container
docker_logs
