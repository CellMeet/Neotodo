# NeoTodo 曲库 / Music Library

这里是播放器的曲库文件夹。首次启动时，NeoTodo 会把它复制到用户数据目录：

- Linux: `~/.local/share/neotodo/music/`
- macOS: `~/Library/Application Support/NeoTodo/music/`
- Windows: `%APPDATA%\NeoTodo\music\`
- Android: 使用播放器里的「从本地添加」按钮，把音频保存到应用内。

## 自定义曲库

1. 把 `.mp3` / `.wav` / `.ogg` / `.flac` / `.m4a` 文件直接放进文件夹，播放器会自动扫描到它。
2. 想自定义标题、作者、颜色和歌词，编辑 `library.json` 的 `tracks` 数组。
3. 歌词使用标准 `.lrc` 文件，和音频同名即可自动匹配，例如 `my-song.mp3` + `my-song.lrc`。
4. 打开播放器里的「曲库」面板，点「刷新」即可重新扫描。
5. 想移除内置曲目，直接删掉文件夹里的音频文件即可；曲库只在第一次为空时播种，之后不会自动补回。

```json
{
  "tracks": [
    {
      "file": "my-song.mp3",
      "title": "My Song",
      "artist": "Me",
      "album": "Home",
      "lrc": "my-song.lrc",
      "color": "#ff4d9d"
    }
  ]
}
```

没有写进 `library.json` 的音频也会以文件名作为标题自动出现在列表里。

## 内置曲目

三首内置曲目是 NeoTodo 为这个播放器生成的原创电子乐，歌词为原创文本，按 LRC 时间轴滚动展示。
