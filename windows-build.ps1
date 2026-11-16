# [win] Build the standalone NeoTodo folder and the Inno Setup installer.
#
#   powershell -ExecutionPolicy Bypass -File windows-build.ps1
#
# The result is dist\NeoTodo\NeoTodo.exe (portable folder) and, when Inno
# Setup 6 is installed, dist\NeoTodo-0.0.1-Windows-x64-setup.exe. Both bundle
# Python, PySide6 and Qt WebEngine, so the target machine needs nothing else.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "==> Checking Python"
& python --version

if (-not (Test-Path ".venv")) {
    Write-Host "==> Creating .venv"
    & python -m venv .venv
}
$py = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

Write-Host "==> Installing build tools"
& $py -m pip install --upgrade pip
& $py -m pip install PySide6 pyinstaller

Write-Host "==> Building dist\NeoTodo"
& $py -m PyInstaller --noconfirm --clean --onedir --windowed `
    --name NeoTodo `
    --icon icon-check.ico `
    --add-data "web;web" `
    --add-data "icon-check.ico;." `
    --add-data "icon-check.png;." `
    --add-data "icon.svg;." `
    --collect-all PySide6 `
    windows_app.py

if (-not (Test-Path "dist\NeoTodo\NeoTodo.exe")) {
    throw "PyInstaller did not produce dist\NeoTodo\NeoTodo.exe"
}

$iscc = @(
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
    "C:\Program Files\Inno Setup 6\ISCC.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($iscc) {
    Write-Host "==> Building the installer"
    & $iscc installer.iss
    Write-Host "Installer: dist\NeoTodo-0.0.1-Windows-x64-setup.exe"
} else {
    Write-Host "Inno Setup 6 not found; the portable folder is ready:"
    Write-Host "  dist\NeoTodo\NeoTodo.exe"
    Write-Host "Install Inno Setup (https://jrsoftware.org/isdl.php) to also get the setup .exe."
}
