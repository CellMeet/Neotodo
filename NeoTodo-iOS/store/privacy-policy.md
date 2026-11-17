# NeoTodo 隐私政策 / Privacy Policy

生效日期：2026-11-17
适用应用：NeoTodo for iOS / iPadOS（Bundle ID `io.github.neotodo`）

## 中文

### 1. 我们收集什么

**不收集任何个人信息。** NeoTodo 没有账号系统，没有云同步，没有统计、崩溃
上报或广告 SDK。

### 2. 你的数据存在哪里

你在应用里创建的分类、待办、子任务、笔记、图片、主题和设置，全部保存在
设备上应用容器内的一个 JSON 文件里：

```
Library/Application Support/.local/share/neotodo/NeoTodo.json
```

这些数据不会离开你的设备，开发者也无法访问。卸载 App 会一并删除。请在卸载
前自行备份需要保留的内容（可通过「文件」App 或 iTunes/Finder 的文件共享功能
导出，若你在系统设置中开启）。

### 3. 网络访问用来做什么

1. **本机回环地址**：应用在 `127.0.0.1` 上启动一个本地 HTTP 服务，把界面
   加载到内置的 WebView 中。该服务不监听外网，也不向外发送数据。
2. **外部链接**：你在笔记里点击的网页链接会交给系统浏览器（Safari）打开，
   不会在应用内加载。
3. **AI（可选，iOS 版默认不可用）**：如果你主动配置了模型服务，并把 API
   地址与 Key 填进设置，应用会直接从你的设备请求**你配置的那个服务**，由其
   隐私政策约束。开发者不参与、不中转、不记录这些请求。

如果你不做任何配置，应用不会连接外部服务器。

### 4. 相册与文件

- 插图、壁纸使用系统提供的**相册选择器**（PHPicker）：应用只能看到你主动
  选择的那几张图片，不会读取整个相册，也不需要相册权限。
- 选择音频等文件时使用系统「文件」选择器：应用只获得你选中的那份文件。
- 这些内容会被复制到应用容器内，用于显示或播放，不会上传到任何服务器。

### 5. 第三方

应用不集成第三方统计、广告或社交 SDK。社区主题与插件由 WebKit 解释运行，
不会下载或执行原生代码。

### 6. 儿童

应用不面向儿童收集任何信息，也不包含面向儿童的广告或内容。

### 7. 变更

本政策如有变更，会更新本页面的生效日期。重大变更会在应用更新说明中提示。

### 8. 联系方式

问题或数据相关请求：`[你的邮箱]`
项目仓库：<https://github.com/CellMeet/Neotodo>

---

## English

### 1. What we collect

**Nothing.** NeoTodo has no accounts, no cloud sync, no analytics, no crash
reporting and no advertising SDKs.

### 2. Where your data lives

Categories, todos, subtasks, notes, images, themes and settings are stored in a
single JSON file inside the app container:

```
Library/Application Support/.local/share/neotodo/NeoTodo.json
```

The data never leaves your device, and the developer cannot access it. Deleting
the app deletes the data.

### 3. What the network is used for

1. **Loopback only.** The app serves its interface to its own WebView from
   `127.0.0.1`. The server is not reachable from the network and sends nothing
   out.
2. **External links** open in Safari, never inside the app.
3. **AI (optional, unavailable on iOS by default).** If you configure a model
   service yourself, the app calls that service directly from your device. The
   developer does not proxy, log or receive those requests.

### 4. Photos and files

Images and wallpapers use the system photo picker: only the items you select are
shared with the app, and no photo-library permission is required. Other uploads
use the system Files picker. Selected files are copied into the app container
and never uploaded anywhere.

### 5. Third parties

No analytics, advertising or social SDKs. Community themes and plugins are data
and JavaScript interpreted by WebKit; no native code is downloaded or executed.

### 6. Children

The app collects no information from children and contains no ads.

### 7. Changes

This policy is updated in place with a new effective date; material changes are
noted in the app's release notes.

### 8. Contact

`[your email]` — <https://github.com/CellMeet/Neotodo>
