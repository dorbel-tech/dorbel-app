#!/bin/bash
# First time install script to install all project dependenices.
# This script is optimized for Linux machines.

echo "Starting to install the apps..."

sudo apt update

# Install git
sudo apt install git

# Install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Install docker
sudo apt-get install apt-transport-https ca-certificates
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
sudo apt-get install docker-engine
sudo service docker start
sudo groupadd docker
sudo usermod -aG docker $USER

# Install docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
sudo apt-get install python3.4
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user
export PATH=~/.local/bin:$PATH
source ~/.bashrc
pip install awscli
pip install awsebcli --upgrade --user

echo "All of the apps were installed succesfully!"
