FROM alpine:latest
ADD . /todo
WORKDIR /todo
EXPOSE 5000
RUN apk --update add python py-pip openssl ca-certificates
RUN apk --update add --virtual build-dependencies python-dev build-base wget
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]
