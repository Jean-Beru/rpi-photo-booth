FROM jeanberu/nodejs

ADD package.json package.json
ADD nodemon.json nodemon.json

RUN apk add --update g++ make python \
    && rm -rf /var/cache/apk/*

EXPOSE 3000

CMD ["npm", "start"]
