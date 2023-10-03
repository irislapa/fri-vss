#!/bin/bash

#install packages to run backend

sudo apt-get update && sudo apt-get upgrade -y
apt-get install python3 -y
python3 -m pip install -r requirements.txt -y
python3 ~/back/manage.py runserver

