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

    Write-Host "==> Packing the download zip"
    $staging = "dist\download"
    if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $staging | Out-Null
    Copy-Item "dist\NeoTodo-0.0.1-Windows-x64-setup.exe" $staging
    @"
NeoTodo for Windows — 安装说明 / Install guide

1. 解压本压缩包，得到 NeoTodo-0.0.1-Windows-x64-setup.exe
2. 双击 setup.exe，按提示一路“下一步”完成安装（不需要管理员权限，也不需要 Python）
3. 从开始菜单或桌面快捷方式启动 NeoTodo
4. 卸载：开始菜单 → NeoTodo → Uninstall NeoTodo，或 设置 → 应用 → NeoTodo

你的任务、主题和设置保存在 %APPDATA%\NeoTodo，卸载不会删除这些数据。

1. Unzip this archive to get NeoTodo-0.0.1-Windows-x64-setup.exe
2. Double-click the setup and follow the wizard (no admin rights, no Python)
3. Launch NeoTodo from the Start Menu or the desktop shortcut
4. Uninstall from Start Menu > NeoTodo > Uninstall NeoTodo, or Settings > Apps

Your notebook data stays in %APPDATA%\NeoTodo when you uninstall.
"@ | Set-Content -Encoding UTF8 "$staging\安装说明.txt"
    Compress-Archive -Path "$staging\*" -DestinationPath "dist\NeoTodo-0.0.1-Windows-x64.zip" -Force

    Write-Host "Installer: dist\NeoTodo-0.0.1-Windows-x64-setup.exe"
    Write-Host "Download zip: dist\NeoTodo-0.0.1-Windows-x64.zip"
} else {
    Write-Host "Inno Setup 6 not found; the portable folder is ready:"
    Write-Host "  dist\NeoTodo\NeoTodo.exe"
    Write-Host "Install Inno Setup (https://jrsoftware.org/isdl.php) to also get the setup .exe and the download zip."
}
