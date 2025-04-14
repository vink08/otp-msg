# Initialize git repository if not already initialized
if (-not (Test-Path -Path ".git")) {
    git init
}

# Add all files to git
git add .

# Commit changes
git commit -m "Initial commit with Vonage integration"

# Add remote repository if not already added
$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin https://github.com/vink08/otp-msg.git
}

# Push to GitHub
git push -u origin master

Write-Host "Project pushed to GitHub successfully!" 