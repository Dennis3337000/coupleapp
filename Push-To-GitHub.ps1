param(
    [string]$RepoUrl = "https://github.com/Dennis3337000/coupleapp.git"
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Initialisiere Git Repository..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

Write-Host "Fuege Dateien hinzu..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: Couple Link App - MVP with Calendar, Meal Planner, Quiz, Lists, Distance & FastAPI Backend"

Write-Host "Setze Remote Origin auf $RepoUrl..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "Pushe auf GitHub main branch..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Erfolgreich auf GitHub gepusht! ($RepoUrl)" -ForegroundColor Green
