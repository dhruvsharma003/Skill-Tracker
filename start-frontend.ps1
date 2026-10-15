# Start SkillTrack React Frontend
$ErrorActionPreference = "Stop"
Write-Host "Starting SkillTrack React Frontend..." -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
