#!/bin/bash

#install packages to run frontend

sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install nodejs -y
node ~/front/app.js
