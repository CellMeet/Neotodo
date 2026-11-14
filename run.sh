# [linux] Desktop launcher for GTK4/WebKitGTK. Windows uses windows_app.py.
#!/bin/sh
cd "$(dirname "$0")"
exec /usr/bin/python3 app.py "$@"
