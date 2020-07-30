FROM ubuntu:16.04
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
RUN RUN pip install pyclamd
# Bundle app source
COPY . /app
EXPOSE 8080
CMD ["app.py"]
ENTRYPOINT ["python"]