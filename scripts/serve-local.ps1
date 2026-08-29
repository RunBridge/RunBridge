# Build, test, and preview the static site on loopback.
# Usage (from repo root or anywhere):
#   .\scripts\serve-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

function Invoke-Npm {
    param([Parameter(Mandatory)][string[]]$ArgumentList)
    & npm.cmd @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "npm $($ArgumentList -join ' ') failed with exit code $LASTEXITCODE"
    }
}

Invoke-Npm install
Invoke-Npm test
Invoke-Npm @('run', 'build')

Write-Host 'Serving http://127.0.0.1:8765/  (Ctrl+C to stop)'
python -m http.server 8765 --bind 127.0.0.1
