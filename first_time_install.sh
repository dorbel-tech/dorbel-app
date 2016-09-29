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

# Install Docker
brew cask install docker

# MOVE TO DOCKER START #
  # # Install MySQL
  # brew install mysql
  # brew tap homebrew/services
  # brew services start mysql

  # # Install node
  # brew install node


  # # Install software
  # brew tap caskroom/cask
  # brew cask install google-chrome
  # brew cask install iterm2
  # brew cask install sublime-text
  # brew cask install sourcetree

  # # Install app dependencies
  # npm install
# MOVE TO DOCKER END #

echo "All of the apps were installed succesfully!"
