#!/bin/bash
docker build -f Dockerfile.prod -t host .
docker run --name temp host
docker cp temp:/app/dist ./dist
docker rm temp
docker image rm host
