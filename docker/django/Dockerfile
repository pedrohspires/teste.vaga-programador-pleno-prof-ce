FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements ./requirements

RUN pip install --upgrade pip && \
    pip install -r requirements/dev.txt

COPY . .