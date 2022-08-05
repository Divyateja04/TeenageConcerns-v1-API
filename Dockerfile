FROM node:alpine

WORKDIR /usr/src/teenageconcerns-api

COPY ./ ./

RUN apk update && apk add bash

RUN npm install

CMD ["/bin/bash"]