#!/bin/bash

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
  git init
fi

# Add all files to git
git add .

# Commit changes
git commit -m "Initial commit with Vonage integration"

# Add remote repository if not already added
if ! git remote | grep -q "origin"; then
  git remote add origin https://github.com/vink08/otp-msg.git
fi

# Push to GitHub
git push -u origin master

echo "Project pushed to GitHub successfully!" 