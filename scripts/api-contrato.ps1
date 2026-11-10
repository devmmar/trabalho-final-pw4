param([string]$Base = 'http://127.0.0.1:8081')
# Confirma como a API responde antes de escrever as telas (tabela da Aula 2).
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root '.env'
$cfg = @{}
Get-Content $envFile | ForEach-Object { if ($_ -match '^([^=]+)=(.*)$') { $cfg[$matches[1]] = $matches[2] } }

function Invoke-Api($method, $path, $body, $token) {
    $params = @{ Uri = "$Base$path"; Method = $method; Headers = @{}; UseBasicParsing = $true }
    if ($token) { $params.Headers.Authorization = "Bearer $token" }
    if ($body) {
        $params.Body = [Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json))
        $params.ContentType = 'application/json; charset=utf-8'
    }
    try {
        $r = Invoke-WebRequest @params
        $json = $null
        if ($r.Content) { try { $json = $r.Content | ConvertFrom-Json } catch {} }
        return [pscustomobject]@{ Status = [int]$r.StatusCode; Json = $json }
    } catch {
        if ($_.Exception.Response) { return [pscustomobject]@{ Status = [int]$_.Exception.Response.StatusCode; Json = $null } }
        throw
    }
}
function Get-Payload($jwt) {
    $p = $jwt.Split('.')[1].Replace('-', '+').Replace('_', '/')
    while ($p.Length % 4) { $p += '=' }
    [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($p)) | ConvertFrom-Json
}
function ConvertTo-Base64Url($text) {
    [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($text)).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}
$rows = New-Object System.Collections.Generic.List[object]
function Add-Row($n, $teste, $esperado, $obtido, $detalhe = '') {
    $rows.Add([pscustomobject]@{ '#' = $n; Teste = $teste; Esperado = $esperado; Obtido = $obtido; OK = ("$esperado" -eq "$obtido"); Detalhe = $detalhe })
}
$criados = @()

$r = Invoke-Api GET '/imoveis'
Add-Row 1 'GET /imoveis sem token' 200 $r.Status

$r = Invoke-Api POST '/public/login' @{ email = $cfg.ADMIN_EMAIL; password = $cfg.ADMIN_PASSWORD }
$adminToken = $r.Json.token
Add-Row 2 'POST /public/login (admin)' 200 $r.Status ("campos: " + (($r.Json.PSObject.Properties.Name) -join ', '))

$claims = Get-Payload $adminToken
$nomes = $claims.PSObject.Properties.Name
$visiveis = ('sub', 'tipo', 'exp' | Where-Object { $nomes -contains $_ }) -join ', '
$exp = [DateTimeOffset]::FromUnixTimeSeconds($claims.exp).LocalDateTime.ToString('HH:mm')
Add-Row 3 'Token decodificado localmente' 'sub, tipo, exp' $visiveis "claims: $($nomes -join ', '); expira=$exp"

$bairro = @{ nome = 'Bairro teste contrato'; cidade = 'Santa Maria'; estado = 'RS' }
$r = Invoke-Api POST '/bairros' $bairro
Add-Row 4 'POST /bairros sem token' 401 $r.Status

$r = Invoke-Api POST '/bairros' $bairro $adminToken
if ($r.Json.id) { $criados += $r.Json.id }
Add-Row 5 'POST /bairros (admin)' 201 $r.Status

# Na primeira execucao o cliente fica salvo no .env para testar o front-end;
# nas seguintes, um cliente temporario e criado e removido ao final.
$bytes = New-Object byte[] 18
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$persistente = -not $cfg.CLIENT_EMAIL
$cliente = @{
    nome = 'Cliente de teste'
    email = if ($persistente) { 'cliente@ventana.test' } else { "cliente-$([guid]::NewGuid().ToString('N').Substring(0, 8))@ventana.test" }
    password = [Convert]::ToBase64String($bytes)
}
$r = Invoke-Api POST '/users' ($cliente + @{ tipo = 'USER' }) $adminToken
$detalhe = "tipo USER -> $($r.Status)"
if ($r.Status -ne 201) {
    $r = Invoke-Api POST '/users' ($cliente + @{ tipo = 'COMUM' }) $adminToken
    $detalhe += "; tipo COMUM -> $($r.Status)"
}
if ($r.Status -eq 201 -and $persistente) {
    Add-Content -Path $envFile -Encoding ascii -Value "CLIENT_EMAIL=$($cliente.email)", "CLIENT_PASSWORD=$($cliente.password)"
    $detalhe += '; credenciais salvas no .env'
} elseif ($r.Json.id) { $temporario = $r.Json.id }
Add-Row 6 'POST /users criando cliente (admin)' 201 $r.Status $detalhe

$r = Invoke-Api POST '/public/login' @{ email = $cliente.email; password = $cliente.password }
$clientToken = $r.Json.token
$perfil = if ($r.Json.tipo) { $r.Json.tipo } elseif ($clientToken) { $c = Get-Payload $clientToken; "$($c.tipo)$($c.role) (no token)" }
Add-Row 7 'Login com o cliente' 200 $r.Status "tipo=$perfil"

$r = Invoke-Api POST '/bairros' $bairro $clientToken
if ($r.Json.id) { $criados += $r.Json.id }
Add-Row 8 'POST /bairros (cliente)' 403 $r.Status

$partes = $clientToken.Split('.')
$alterado = (Get-Payload $clientToken)
foreach ($campo in 'tipo', 'role') { if ($alterado.PSObject.Properties.Name -contains $campo) { $alterado.$campo = 'ADMIN' } }
$adulterado = "$($partes[0]).$(ConvertTo-Base64Url ($alterado | ConvertTo-Json -Compress)).$($partes[2])"
$r = Invoke-Api POST '/bairros' $bairro $adulterado
if ($r.Json.id) { $criados += $r.Json.id }
Add-Row 9 'POST /bairros com token adulterado' 401 $r.Status 'perfil trocado para ADMIN, assinatura original'

foreach ($id in $criados) { Invoke-Api DELETE "/bairros/$id" $null $adminToken | Out-Null }
if ($temporario) { Invoke-Api DELETE "/users/$temporario" $null $adminToken | Out-Null }
$rows | Format-Table -AutoSize -Wrap
if ($rows | Where-Object { -not $_.OK }) { exit 1 }
