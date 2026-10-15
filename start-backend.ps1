# Start SkillTrack Spring Boot Backend
$ErrorActionPreference = "Stop"
Write-Host "Starting SkillTrack Spring Boot Backend..." -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
Set-Location -Path "$PSScriptRoot\backend"
& ".\mvnw.cmd" spring-boot:run
