FROM tiangolo/uwsgi-nginx-flask
MAINTAINER "Devnetops Team"
RUN apk add --no-cache --virtual .build-deps libressl-dev libffi-dev gcc musl-dev
COPY UserMgmt /UserMgmt
WORKDIR /UserMgmt
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]
