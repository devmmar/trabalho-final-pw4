param([switch]$PrepareOnly)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    foreach ($bin in @("$env:ProgramFiles/Docker/Docker/resources/bin", "$env:LOCALAPPDATA/Programs/DockerDesktop/resources/bin")) {
        if (Test-Path "$bin/docker.exe") { $env:Path = "$bin;$env:Path"; break }
    }
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Instale o Docker Desktop, abra-o e execute este script novamente.'
}

function New-LocalSecret {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    return [Convert]::ToBase64String($bytes)
}

$envFile = Join-Path $root '.env'
if (-not (Test-Path $envFile)) {
    $adminEmail = 'admin@localhost'
    $adminPassword = New-LocalSecret
    $jwtSecret = New-LocalSecret
    @("DB_PASSWORD=$(New-LocalSecret)", "DB_ROOT_PASSWORD=$(New-LocalSecret)",
      "JWT_SECRET=$jwtSecret", "ADMIN_EMAIL=$adminEmail", "ADMIN_PASSWORD=$adminPassword",
      'WEB_PORT=3000', 'API_PORT=8081', 'DB_PORT=3307', 'PMA_PORT=8090', 'MAIL_PORT=8025') |
        Set-Content -Path $envFile -Encoding ascii
    Write-Host 'Configuracao local criada em .env (ignorada pelo Git).'
}

& docker compose config --quiet
if ($LASTEXITCODE -ne 0) { throw 'Configuracao Compose invalida. Confira .env.' }
if ($PrepareOnly) { Write-Host 'Configuracao validada. Pronta para subir apos o Docker Engine iniciar.'; return }
& docker info --format '{{.ServerVersion}}' 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Docker Engine indisponivel. Abra Docker Desktop e aguarde o engine iniciar. Se o WSL acabou de ser instalado, reinicie o Windows.' }
& docker compose up -d --build --wait --wait-timeout 300
if ($LASTEXITCODE -ne 0) { throw 'Falha ao iniciar. Execute docker compose logs --tail 100 para diagnosticar.' }
& docker compose ps
Write-Host 'Front-end: http://localhost:3000 | API: http://localhost:8081/imoveis'
Write-Host 'phpMyAdmin: http://localhost:8090 | E-mails de teste: http://localhost:8025'
Write-Host 'Credenciais: .env. Para parar preservando os dados: docker compose down'
