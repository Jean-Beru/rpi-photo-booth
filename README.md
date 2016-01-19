# Take-a-pic

Take pictures from a Raspberry PI cam

# Install

```sh
# Clone project
git clone SOON...
cd take-a-pic

# Install dependencies
docker-compose run --rm app npm install

# Run server
docker-compose up -d
```

# Develop on Take-a-pic

```sh
# Run a shell in Docker
dc run --rm --service-ports app /bin/sh

# Emulate camera
dc run --rm  app node stream_faker.js
```
