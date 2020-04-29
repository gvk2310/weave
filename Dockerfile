FROM alpine:latest
MAINTAINER "Devnetops Team"
ADD UserMgmt /UserMgmt
WORKDIR /UserMgmt
RUN apk add --update py-pip
RUN apk add --no-cache --virtual .build-deps gcc musl-dev \
     && pip install cython
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]

