FROM hypriot/rpi-node

RUN apt-get update \
    && apt-get install -y make python git build-essential cmake curl \
    && rm -rf /var/cache/apt/* \
    && cd \
    && git clone --depth 1 https://github.com/raspberrypi/userland.git \
    && cd userland \
    && ./buildme \
    && usermod -a -G video root \
    && mkdir -p /app

RUN echo '/opt/vc/lib' >> /etc/ld.so.conf.d/00-vmcs.conf \
    && ldconfig

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
