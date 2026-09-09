<#
.SYNOPSIS
    Prepara e sincroniza os arquivos de lançamento (v1.0.0) do Git para a estrutura local do SVN do WordPress.org.

.DESCRIPTION
    Este script valida os metadados do plugin e copia os arquivos limpos de produo para:
    - C:\wordpress-svn\luiz0067-carousel-slides\trunk
    - C:\wordpress-svn\luiz0067-carousel-slides\tags\1.0.0
    - C:\wordpress-svn\luiz0067-carousel-slides\assets (assets do repositrio WP.org)
#>

[CmdletBinding()]
param (
    [string]$GitRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$SvnRoot = "C:\wordpress-svn\luiz0067-carousel-slides",
    [string]$Version = "1.0.0",
    [switch]$LaunchTortoiseCommit
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   PREPARAÇÃO DE RELEASE WORDPRESS.ORG - v$Version" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Validação de arquivos essenciais
$mainPhp = Join-Path $GitRoot "luiz0067-carousel-slides.php"
$readmeTxt = Join-Path $GitRoot "readme.txt"

if (-not (Test-Path $mainPhp)) {
    throw "Arquivo principal PHP não encontrado: $mainPhp"
}
if (-not (Test-Path $readmeTxt)) {
    throw "Arquivo readme.txt não encontrado: $readmeTxt"
}

# Validar Versão no PHP
$phpContent = Get-Content $mainPhp -Raw
if ($phpContent -notmatch "Version:\s+$Version") {
    Write-Warning "Versão $Version não encontrada no cabeçalho de $mainPhp"
} else {
    Write-Host "[OK] Versão $Version confirmada no arquivo principal PHP." -ForegroundColor Green
}

# Validar Stable tag no readme.txt
$readmeContent = Get-Content $readmeTxt -Raw
if ($readmeContent -notmatch "Stable tag:\s+$Version") {
    Write-Warning "Stable tag $Version não encontrada em $readmeTxt"
} else {
    Write-Host "[OK] Stable tag $Version confirmada no readme.txt." -ForegroundColor Green
}

# 2. Verificar se o diretório do SVN existe
if (-not (Test-Path $SvnRoot)) {
    Write-Host "`nO diretório SVN local ainda não existe: $SvnRoot" -ForegroundColor Yellow
    Write-Host "Deseja que o TortoiseSVN abra para realizar o Checkout inicial de:" -ForegroundColor Yellow
    Write-Host "https://plugins.svn.wordpress.org/luiz0067-carousel-slides" -ForegroundColor Cyan
    
    $tortoiseProc = "C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe"
    if (Test-Path $tortoiseProc) {
        New-Item -ItemType Directory -Path $SvnRoot -Force | Out-Null
        & $tortoiseProc /command:checkout /url:"https://plugins.svn.wordpress.org/luiz0067-carousel-slides" /path:"$SvnRoot"
        Write-Host "Após concluir o Checkout no TortoiseSVN, execute este script novamente para sincronizar os arquivos." -ForegroundColor Yellow
        return
    } else {
        throw "Diretório $SvnRoot não encontrado e TortoiseSVN não detectado no caminho padrão."
    }
}

# 3. Definir pastas de destino
$trunkDir  = Join-Path $SvnRoot "trunk"
$tagDir    = Join-Path $SvnRoot "tags\$Version"
$assetsDir = Join-Path $SvnRoot "assets"

New-Item -ItemType Directory -Path $trunkDir -Force | Out-Null
New-Item -ItemType Directory -Path $tagDir -Force | Out-Null
New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null

# 4. Lista de exclusão para arquivos do plugin
$excludePatterns = @(
    "^\.git",
    "^\.github",
    "^\.gitignore",
    "^\.distignore",
    "^README\.md$",
    "^scripts",
    "^screenshot.*\.png$",
    "^tags",
    "^trunk",
    "\.zip$",
    "\.tar\.gz$",
    "^\.DS_Store$",
    "^Thumbs\.db$"
)

Write-Host "`nSincronizando arquivos de produção para trunk\ e tags\$Version\..." -ForegroundColor Cyan

# Função para copiar ignorando arquivos de desenvolvimento
function Sync-PluginFolder {
    param (
        [string]$Source,
        [string]$Destination
    )

    Get-ChildItem -Path $Source -Recurse | ForEach-Object {
        $relPath = $_.FullName.Substring($Source.Length).TrimStart("\", "/")
        
        # Verificar se coincide com algum padrão de exclusão
        $shouldExclude = $false
        foreach ($pattern in $excludePatterns) {
            if ($relPath -match $pattern) {
                $shouldExclude = $true
                break
            }
        }

        if (-not $shouldExclude) {
            $destPath = Join-Path $Destination $relPath
            if ($_.PSIsContainer) {
                if (-not (Test-Path $destPath)) {
                    New-Item -ItemType Directory -Path $destPath -Force | Out-Null
                }
            } else {
                $destFolder = Split-Path -Parent $destPath
                if (-not (Test-Path $destFolder)) {
                    New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
                }
                Copy-Item -Path $_.FullName -Destination $destPath -Force
            }
        }
    }
}

# Limpar trunk e tag antes de copiar
Get-ChildItem -Path $trunkDir -Exclude ".svn" | Remove-Item -Recurse -Force
Get-ChildItem -Path $tagDir -Exclude ".svn" | Remove-Item -Recurse -Force

Sync-PluginFolder -Source $GitRoot -Destination $trunkDir
Sync-PluginFolder -Source $GitRoot -Destination $tagDir

Write-Host "[OK] trunk\ atualizado com sucesso." -ForegroundColor Green
Write-Host "[OK] tags\$Version\ atualizado com sucesso." -ForegroundColor Green

# 5. Copiar assets do diretório WordPress.org
$screenshot1 = Join-Path $GitRoot "screenshot-1.png"
if (-not (Test-Path $screenshot1)) {
    $origScreenshot = Join-Path $GitRoot "screenshot.png"
    if (Test-Path $origScreenshot) {
        Copy-Item -Path $origScreenshot -Destination $screenshot1 -Force
    }
}

if (Test-Path $screenshot1) {
    Copy-Item -Path $screenshot1 -Destination (Join-Path $assetsDir "screenshot-1.png") -Force
    Write-Host "[OK] Assets: screenshot-1.png copiado para assets\." -ForegroundColor Green
}

Write-Host "`nArquivos sincronizados com sucesso!" -ForegroundColor Green

$tortoiseProc = "C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe"
if (Test-Path $tortoiseProc) {
    Write-Host "`n[TortoiseSVN] Abrindo assistente para registrar arquivos no SVN..." -ForegroundColor Cyan
    Start-Process $tortoiseProc -ArgumentList "/command:add", "/path:`"$SvnRoot`"" -Wait
    
    Write-Host "`n[TortoiseSVN] Abrindo janela de Commit para liberar a versão $Version..." -ForegroundColor Cyan
    Start-Process $tortoiseProc -ArgumentList "/command:commit", "/path:`"$SvnRoot`"", "/logmsg:`"Releasing version $Version: Initial release of luiz0067 Carousel Slides`""
} else {
    Write-Host "`nAbra o TortoiseSVN manualmente em $SvnRoot para executar 'Add' e 'Commit'." -ForegroundColor Yellow
}

