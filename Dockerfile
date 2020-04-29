FROM python:3.8.2-alpine3.11
MAINTAINER "Devnetops Team"
ADD UserMgmt /UserMgmt
WORKDIR /UserMgmt
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]

