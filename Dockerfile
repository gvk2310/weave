FROM python:3.8-alpine3.11
MAINTAINER "Devnetops Team"
ARG ENV
RUN apk add --no-cache --virtual .build-deps libressl-dev libffi-dev gcc musl-dev
#COPY UserMgmt /UserMgmt
#WORKDIR /UserMgmt
#RUN pip install -r requirements.txt
RUN if [ ${ENV} = "DEV" ] ; then COPY UserMgmt /UserMgmt && WORKDIR /UserMgmt && pip install -r requirements.txt ;
	else COPY UserMgmt /UserMgmt && WORKDIR /UserMgmt && pip install -r requirements.txt ; fi
CMD ["uwsgi", "--ini", "uwsgi.ini"]
