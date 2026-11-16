#!/bin/sh
# [linux] Install NeoTodo system-wide: /opt/neotodo + /usr/local/bin/neotodo.
#
#   sudo NeoTodo-Linux/install-system.sh              # install the current tree
#   sudo NeoTodo-Linux/install-system.sh --uninstall  # remove it again
#
# The script copies the Linux sources (default: the working tree next to this
# folder) into /opt/neotodo, then drops a `neotodo` launcher in /usr/local/bin,
# a menu entry and the app icons. Tasks and settings keep living in
# ~/.local/share/neotodo, so an existing install keeps its data.
set -eu

PREFIX="${NEOTODO_PREFIX:-/opt/neotodo}"
BIN_DIR="${NEOTODO_BIN_DIR:-/usr/local/bin}"
APPS_DIR="${NEOTODO_APPS_DIR:-/usr/share/applications}"
ICON_DIR="${NEOTODO_ICON_DIR:-/usr/share/icons/hicolor}"
BIN="$BIN_DIR/neotodo"
DESKTOP="$APPS_DIR/io.github.neotodo.desktop"
ICON_SVG="$ICON_DIR/scalable/apps/io.github.neotodo.svg"
ICON_256="$ICON_DIR/256x256/apps/io.github.neotodo.png"
ICON_128="$ICON_DIR/128x128/apps/io.github.neotodo.png"

if [ -z "${NEOTODO_PREFIX:-}" ] && [ "$(id -u)" -ne 0 ]; then
    echo "Run this with sudo: sudo $0" >&2
    exit 1
fi

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
if [ -f "$ROOT/app.py" ] && [ -d "$ROOT/web" ]; then
    SRC="$ROOT"
else
    SRC="$HERE"
fi

refresh_caches() {
    command -v update-desktop-database >/dev/null 2>&1 &&
        update-desktop-database "$APPS_DIR" || true
    command -v gtk-update-icon-cache >/dev/null 2>&1 &&
        gtk-update-icon-cache -f -t "$ICON_DIR" || true
}

if [ "${1:-}" = "--uninstall" ]; then
    rm -rf "$PREFIX" "$BIN" "$DESKTOP" "$ICON_SVG" "$ICON_256" "$ICON_128"
    refresh_caches
    echo "Removed $PREFIX, $BIN and the menu entry."
    echo "Tasks and settings are untouched in ~/.local/share/neotodo."
    exit 0
fi

if [ ! -f "$SRC/app.py" ] || [ ! -d "$SRC/web" ]; then
    echo "Cannot find app.py + web/ in $SRC" >&2
    exit 1
fi

echo "Installing from $SRC"

rm -rf "$PREFIX"
mkdir -p "$PREFIX" "$BIN_DIR" "$APPS_DIR" \
    "$ICON_DIR/scalable/apps" "$ICON_DIR/256x256/apps" "$ICON_DIR/128x128/apps"

cp "$SRC/app.py" "$SRC/startup.py" "$PREFIX/"
cp "$SRC/icon.svg" "$SRC/icon.png" "$SRC/icon-check.svg" "$PREFIX/"

if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude '__pycache__' --exclude '*.pyc' --exclude '__*.html' \
        "$SRC/web/" "$PREFIX/web/"
else
    cp -R "$SRC/web" "$PREFIX/web"
    find "$PREFIX/web" -name '__pycache__' -type d -prune -exec rm -rf {} +
    rm -f "$PREFIX/web"/__*.html
fi

cat > "$PREFIX/run.sh" <<EOF
#!/bin/sh
# [linux] NeoTodo launcher for the system install in $PREFIX.
cd "$PREFIX"
exec /usr/bin/python3 app.py "\$@"
EOF

cat > "$BIN" <<EOF
#!/bin/sh
# [linux] NeoTodo — system install in $PREFIX.
exec "$PREFIX/run.sh" "\$@"
EOF

cat > "$DESKTOP" <<EOF
[Desktop Entry]
Type=Application
Name=NeoTodo
GenericName=Weekly Postcard Todo
Comment=A quiet home for weekly focus and postcard memories
Exec=$BIN
Icon=io.github.neotodo
Terminal=false
Categories=Utility;
StartupWMClass=io.github.neotodo
StartupNotify=true
Actions=NewWindow;

[Desktop Action NewWindow]
Name=New Window
Exec=$BIN --new-window
Icon=io.github.neotodo
EOF

cp "$PREFIX/icon-check.svg" "$ICON_SVG"
cp "$PREFIX/icon.png" "$ICON_256"
cp "$PREFIX/icon.png" "$ICON_128"

chmod 755 "$PREFIX/run.sh" "$BIN"
chmod -R a+rX "$PREFIX"
refresh_caches

echo "Installed $PREFIX"
echo "Launcher:  $BIN"

if [ -n "${SUDO_USER:-}" ]; then
    USER_HOME="$(getent passwd "$SUDO_USER" | cut -d: -f6 || true)"
    if [ -n "$USER_HOME" ] && [ -e "$USER_HOME/.local/bin/neotodo" ]; then
        echo
        echo "Note: $USER_HOME/.local/bin/neotodo still exists and comes earlier" >&2
        echo "on PATH. Remove it to run this system install:" >&2
        echo "  rm -f $USER_HOME/.local/bin/neotodo" >&2
        echo "  rm -rf $USER_HOME/.local/opt/neotodo" >&2
    fi
fi
