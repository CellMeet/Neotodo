; [win] NeoTodo installer for the standalone PyInstaller build.
;
; The build ships Python, PySide6 and Qt WebEngine inside the app folder, so
; the user installs one setup .exe and starts NeoTodo like any other Windows
; application: no Python, no pip, no terminal.
;
; Build:
;   pyinstaller --noconfirm --clean --onedir --windowed --name NeoTodo ^
;     --icon icon-check.ico --add-data "web;web" ^
;     --add-data "icon-check.ico;." --add-data "icon-check.png;." ^
;     --add-data "icon.svg;." --collect-all PySide6 windows_app.py
;   ISCC.exe installer.iss
;
; The result is dist\NeoTodo-0.0.1-Windows-x64-setup.exe.

[Setup]
AppId={{4A0C2D2A-8E2B-4B7A-9D8C-4F1B7C3A9E11}
AppName=NeoTodo
AppVersion=0.0.1
AppVerName=NeoTodo 0.0.1
AppPublisher=CellMeet
AppPublisherURL=https://github.com/CellMeet/Neotodo
AppSupportURL=https://github.com/CellMeet/Neotodo
AppUpdatesURL=https://github.com/CellMeet/Neotodo/releases
VersionInfoVersion=0.0.1
VersionInfoCompany=CellMeet
VersionInfoDescription=NeoTodo desktop notebook installer
VersionInfoProductName=NeoTodo
DefaultDirName={autopf}\NeoTodo
DefaultGroupName=NeoTodo
DisableProgramGroupPage=yes
DisableDirPage=auto
; Install for the current user by default: no administrator prompt for a
; normal install, while "install for all users" is still offered.
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
OutputDir=dist
OutputBaseFilename=NeoTodo-0.0.1-Windows-x64-setup
SetupIconFile=icon-check.ico
UninstallDisplayIcon={app}\NeoTodo.exe
UninstallDisplayName=NeoTodo
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; Ask Windows to close a running NeoTodo while upgrading over it.
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"; Flags: checkedonce

[InstallDelete]
; The bundled runtime changes between releases; replace it instead of mixing
; an old and a new PyInstaller folder.
Type: filesandordirs; Name: "{app}\_internal"

[Files]
Source: "dist\NeoTodo\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; One Start Menu folder with the app and its uninstaller. Inno Setup also
; registers the same uninstaller under Settings → Apps ("NeoTodo"), so the app
; can be removed from either place; the notebook data in %APPDATA%\NeoTodo is
; left alone.
Name: "{group}\NeoTodo"; Filename: "{app}\NeoTodo.exe"; WorkingDir: "{app}"
Name: "{group}\Uninstall NeoTodo"; Filename: "{uninstallexe}"
Name: "{autodesktop}\NeoTodo"; Filename: "{app}\NeoTodo.exe"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\NeoTodo.exe"; Description: "Launch NeoTodo"; Flags: nowait postinstall skipifsilent
