FROM python:3.7
WORKDIR /app
ADD . /app
RUN python setup.py develop
RUN mkdir -p /tmp/pilates/uploads
EXPOSE 8080
