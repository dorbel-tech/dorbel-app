#!/bin/bash
# First time install script to install all project dependenices.
# This script is optimized for Mac machines.

echo "Starting to install the apps..."

# Install Xcode
xcode-select --install

# Install Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install node
brew install node
brew install yarn

# Install git
brew install git

# Install AWS CLI
brew install awscli
brew install awsebcli

# Install Flow support
brew install flow

# For webpack hot reload to work on Mac
npm install fsevents -g

# Installing Docker
brew install docker docker-machine docker-compose

# Tap homebrew/completion to gain access to these
brew tap homebrew/completions
 
# Install completions for docker suite
brew install docker-completion
brew install docker-compose-completion
brew install docker-machine-completion

# Install software
brew tap caskroom/cask
brew cask install google-chrome
brew cask install iterm2
brew cask install visual-studio-code
brew cask install gitkraken
brew cask install meld
brew cask install sequel-pro
brew cask install skitch
brew cask install spectacle
brew cask install slack

echo "All of the apps were installed succesfully!"
