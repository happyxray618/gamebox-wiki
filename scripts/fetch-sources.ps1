param([string]$ProxyUrl = 'http://127.0.0.1:7890')
$ErrorActionPreference = 'Stop'
$manifest = Get-Content -LiteralPath 'scripts/source-manifest.json' -Raw | ConvertFrom-Json
New-Item -ItemType Directory -Force '.cache/gamebox' | Out-Null
$cacheDirectory = (Resolve-Path '.cache/gamebox').Path
$manifest | ForEach-Object -Parallel {
  $entry = $_
  $targetFile = Join-Path $using:cacheDirectory ($entry.slug + '.html')
  if ((Test-Path -LiteralPath $targetFile) -and (Get-Item -LiteralPath $targetFile).Length -gt 1000) { return }
  try {
    Invoke-WebRequest -Uri $entry.url -Proxy $using:ProxyUrl -TimeoutSec 40 -OutFile $targetFile
    Write-Output ('OK ' + $entry.slug)
  } catch {
    Write-Output ('FAILED ' + $entry.slug + ': ' + $_.Exception.Message)
  }
} -ThrottleLimit 4
