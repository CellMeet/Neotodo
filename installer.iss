[Setup]
AppId={{4A0C2D2A-8E2B-4B7A-9D8C-4F1B7C3A9E11}
AppName=NeoTodo
AppVersion=0.0.1
AppPublisher=CellMeet
AppPublisherURL=https://github.com/CellMeet/Neotodo
AppSupportURL=https://github.com/CellMeet/Neotodo
DefaultDirName={autopf}\NeoTodo
DefaultGroupName=NeoTodo
DisableProgramGroupPage=yes
OutputDir=dist
OutputBaseFilename=NeoTodo-0.0.1-Windows-x64-setup
SetupIconFile=icon-check.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\NeoTodo.exe

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"; Flags: checkedonce

[Files]
Source: "dist\NeoTodo.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\NeoTodo"; Filename: "{app}\NeoTodo.exe"
Name: "{autodesktop}\NeoTodo"; Filename: "{app}\NeoTodo.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\NeoTodo.exe"; Description: "Launch NeoTodo"; Flags: nowait postinstall skipifsilent
