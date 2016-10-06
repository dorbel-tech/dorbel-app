#!/bin/bash
# This script is optimized for Mac machines.
echo "Starting to install the apps..."

# Install Xcode
xcode-select --install

# Install Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install git
brew install git

# Install AWS CLI
brew install awscli
brew install awsebcli
brew install amazon-ecs-cli

# Install Docker
brew cask install docker

# Install software
brew tap caskroom/cask
brew cask install google-chrome
brew cask install iterm2
brew cask install sublime-text
brew cask install sourcetree

echo "All of the apps were installed succesfully!"
