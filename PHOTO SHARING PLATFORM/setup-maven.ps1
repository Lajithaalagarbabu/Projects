$ProgressPreference = 'SilentlyContinue'
$targetDir = "$PSScriptRoot\.maven"
$zipPath = "$env:TEMP\apache-maven.zip"

if (-not (Test-Path "$targetDir\bin\mvn.cmd")) {
    Write-Host "Downloading portable Maven..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip" -OutFile $zipPath
    
    Write-Host "Extracting Maven..."
    $extractPath = "$env:TEMP\mvn_extract"
    if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    
    if (-not (Test-Path "$PSScriptRoot\.maven")) { New-Item -ItemType Directory -Path "$PSScriptRoot\.maven" | Out-Null }
    Copy-Item -Path "$extractPath\apache-maven-3.9.6\*" -Destination $targetDir -Recurse -Force
    
    Remove-Item $zipPath -Force
    Remove-Item $extractPath -Recurse -Force
    Write-Host "Portable Maven setup complete!"
} else {
    Write-Host "Maven already set up in .maven!"
}
