# syntax=docker/dockerfile:1

# Add base layer for app
FROM node:10-alpine AS builder

# Set base destination directory inside image
RUN mkdir /app
WORKDIR /app

# Copy all files inside image (to the workdir)
COPY ./ ./

#USER node

RUN npm install

EXPOSE 5001

# Run app
CMD [ "node", "index.js" ]