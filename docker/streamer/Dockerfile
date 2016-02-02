FROM hypriot/rpi-node

RUN apt-get update \
    && apt-get install -y make python git build-essential cmake curl \
    && cd \
    && git clone --depth 1 https://github.com/raspberrypi/userland.git \
    && cd userland \
    && ./buildme \
    && usermod -a -G video root \
    && echo '/opt/vc/lib' >> /etc/ld.so.conf.d/00-vmcs.conf \
    && ldconfig

RUN apt-get -y install libjpeg8-dev imagemagick libv4l-dev \
    && ln -s /usr/include/linux/videodev2.h /usr/include/linux/videodev.h \
    && cd \
    && wget http://sourceforge.net/code-snapshots/svn/m/mj/mjpg-streamer/code/mjpg-streamer-code-182.zip \
    && unzip mjpg-streamer-code-182.zip \
    && cd mjpg-streamer-code-182/mjpg-streamer \
    && make mjpg_streamer input_file.so output_http.so \
    && cp mjpg_streamer /usr/local/bin \
    && cp output_http.so input_file.so /usr/local/lib/ \
    && cp -R www /usr/local/www \
    && cd \
    && rm -rf mjpg-streamer-182 \
    && mkdir /stream

RUN rm -rf /var/cache/apt/*

WORKDIR /stream

CMD ["LD_LIBRARY_PATH=/usr/local/lib", "mjpg_streamer", "-i \"input_file.so -f /stream -n pic.jpg\"", "-o \"output_http.so -w /usr/local/www\""]
