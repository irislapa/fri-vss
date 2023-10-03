FROM python:3.8

# Copy the requirements file
COPY ./requirements.txt /home

# Set the working directory
WORKDIR /home

# Install pip
RUN apt-get update -y
RUN apt-get install python3-pip -y

# Install the dependencies
RUN pip install -r requirements.txt


EXPOSE 8000

