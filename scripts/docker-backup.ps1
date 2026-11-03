$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
New-Item -ItemType Directory -Path backups -Force | Out-Null
$destination = "backups/imobiliaria-$(Get-Date -Format yyyyMMdd-HHmmss).sql"
# O redirecionamento acontece no container, evitando conversao de encoding do PowerShell.
& docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u "$MYSQL_USER" --single-transaction --no-tablespaces projetoimobiliaria > /tmp/backup.sql'
if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar backup.' }
& docker compose cp db:/tmp/backup.sql $destination
if ($LASTEXITCODE -ne 0) { throw 'Falha ao copiar backup.' }
Write-Host "Backup salvo em $destination"
