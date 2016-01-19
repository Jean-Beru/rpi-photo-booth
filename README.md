# Take-a-pic

Take pictures from a Raspberry PI cam

# Install

```sh
# Clone project
git clone SOON...
cd take-a-pic

# Install dependencies
docker-compose -f docker/alpine/docker-compose.yml run --rm app npm install

# Run server
docker-compose -f docker/alpine/docker-compose.yml  up -d
```

# Develop on Take-a-pic

```sh
# Run a shell in Docker
docker-compose -f docker/alpine/docker-compose.yml  run --rm --service-ports app /bin/sh

# Emulate camera
docker-compose -f docker/alpine/docker-compose.yml  run --rm  app node stream_faker.js
```

# Note
Change `docker/alpine/docker-compose.yml` to `docker/hypriot/docker-compose.yml` for RPI installation.
