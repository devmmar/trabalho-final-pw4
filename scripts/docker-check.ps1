$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$config = @{}
Get-Content .env | Where-Object { $_ -match '^\w+=' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    $config[$key] = $value
}
$web = "http://127.0.0.1:$($config.WEB_PORT)"
$api = "http://127.0.0.1:$($config.API_PORT)"
foreach ($url in @($web, "$web/api/imoveis", "$api/bairros", "http://127.0.0.1:$($config.PMA_PORT)", "http://127.0.0.1:$($config.MAIL_PORT)")) {
    $response = Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -ne 200) { throw "Resposta inesperada: $url" }
    Write-Host "OK $url"
}
try {
    Invoke-WebRequest "$api/users" -UseBasicParsing -ErrorAction Stop | Out-Null
    throw 'GET /users aceitou acesso sem token.'
} catch {
    if (-not $_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 401) { throw }
    Write-Host 'OK /users sem token retorna 401'
}
$body = @{ email = $config.ADMIN_EMAIL; password = $config.ADMIN_PASSWORD } | ConvertTo-Json
$login = Invoke-RestMethod "$api/public/login" -Method Post -ContentType 'application/json' -Body $body
$response = Invoke-WebRequest "$api/users" -UseBasicParsing -Headers @{ Authorization = "Bearer $($login.token)" }
if ($response.StatusCode -ne 200) { throw 'Falha na consulta autenticada.' }
Write-Host 'OK login JWT e consulta de administrador'
