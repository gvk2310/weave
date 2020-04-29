FROM python:3.8-buster
MAINTAINER "Devnetops Team"
ADD UserMgmt /UserMgmt
WORKDIR /UserMgmt
RUN pip install -r requirements.txt
#CMD ["python", "run.py"]
CMD ["uwsgi", "--ini", "uwsgi.ini"]
