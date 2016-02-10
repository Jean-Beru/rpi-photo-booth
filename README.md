# RPI-photo-booth

Take pictures from a Raspberry PI cam

# Install

```sh
# Clone project
git clone https://github.com/Jean-Beru/rpi-photo-booth.git
cd rpi-photo-booth

# Run server
npm start
```

# Develop on RPI-photo-booth

```sh
# Run server in Docker
docker-compose up -d

# Run tests in Docker
docker-compose run --rm app npm test
```

# Note
No Dockerfile for raspbian (or hypriot) at the moment.
