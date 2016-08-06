FROM jeanberu/nodejs

RUN mkdir -p /app \
    && apk add --update g++ make python git imagemagick \
    && rm -rf /var/cache/apk/*

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
