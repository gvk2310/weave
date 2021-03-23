FROM node:14-alpine
ARG user=devnetopsuser
ARG group=devnetopsuser
ARG uid=2000
ARG gid=2000
RUN apk update
WORKDIR /devnetopsuser
RUN addgroup -g ${gid} ${group} \
    && adduser -h /devnetopsuser -u ${uid} -G ${group} -s /bin/sh -D ${user}
COPY . /devnetopsuser
RUN chown -R devnetopsuser:devnetopsuser /devnetopsuser
RUN chmod +x replaceEnv.sh
RUN npm install
USER devnetopsuser
EXPOSE 15006
ENTRYPOINT /devnetopsuser/replaceEnv.sh