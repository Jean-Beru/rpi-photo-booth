FROM jeanberu/nodejs

RUN mkdir -p /app \
    && apk add --update g++ make python \
    && rm -rf /var/cache/apk/*

WORKDIR /app

ONBUILD RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
