# Drop release files here before deploying

`python3 site/build.py` copies every file in this folder into
`site/dist/files/` and writes its size + sha256 back into the built
`downloads.json`.

The file name must match the `file` field of an artifact:

```
NeoTodo-0.0.1-Windows-x64.zip          # 安装包 .zip（内含 setup.exe）
NeoTodo-0.0.1-Windows-x64-setup.exe    # 可选：直接下载安装程序
NeoTodo-0.0.1-Linux-x86_64.tar.gz
NeoTodo-0.0.1-Android.apk
```

Nothing in this folder is committed; it is only the staging shelf for the
server upload.
