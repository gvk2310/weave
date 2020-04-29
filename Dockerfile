FROM python:3.8-alpine3.11
MAINTAINER "Devnetops Team"
RUN apk add --no-cache --virtual .build-deps libressl-dev libffi-dev gcc musl-dev
COPY UserMgmt /UserMgmt
WORKDIR /UserMgmt
RUN pip install -r requirements.txt \
      && apk del .build-deps
CMD ["uwsgi", "--ini", "uwsgi.ini"]
