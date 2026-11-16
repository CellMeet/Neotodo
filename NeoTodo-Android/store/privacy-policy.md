# NeoTodo 隐私政策 / Privacy Policy

生效日期：2026-11-16
适用应用：NeoTodo for Android（包名 `io.github.neotodo`）

## 中文

### 1. 我们收集什么

**不收集任何个人信息。** NeoTodo 没有账号系统，没有云同步，没有统计、
崩溃上报或广告 SDK。

### 2. 你的数据存在哪里

你在应用里创建的分类、待办、子任务、笔记、图片、主题和设置，全部保存在
设备上应用私有目录里的一个 JSON 文件（`files/.local/share/neotodo/NeoTodo.json`）。
这些数据不会离开你的设备，我们（开发者）也无法访问。

卸载应用会删除这些数据。请在卸载前自行备份需要保留的内容。

### 3. 网络权限用来做什么

应用声明了 `INTERNET` 权限，用于：

1. 在本机 `127.0.0.1` 上启动一个本地 HTTP 服务，把界面加载到应用内。这个
   服务不对外网开放，也不会向外发送数据。
2. 如果你主动配置了 AI 模型（本机命令行工具或你自己的 API Key），应用会把
   你的输入发送到**你配置的那个服务**，由该服务按其隐私政策处理。开发者
   不参与、不中转、不记录这些请求。

如果你不配置 AI，应用不会主动连接任何外部服务器。

### 4. 第三方

应用不集成第三方统计、广告或社交 SDK。AI 功能属于可选的自带密钥接入，第三方
服务的行为由其自身隐私政策约束。

### 5. 儿童

应用不面向儿童收集任何信息，也不包含面向儿童的广告或内容。

### 6. 变更

本政策如有变更，会更新本页面的生效日期。重大变更会在应用更新说明中提示。

### 7. 联系方式

问题或数据相关请求：`[你的邮箱]`
项目仓库：<https://github.com/CellMeet/Neotodo>

---

## English

### 1. What we collect

**Nothing.** NeoTodo has no accounts, no cloud sync, no analytics, no crash
reporting and no advertising SDKs.

### 2. Where your data lives

Categories, tasks, subtasks, notes, images, themes and settings are stored in a
single JSON file inside the app's private storage
(`files/.local/share/neotodo/NeoTodo.json`). The data never leaves your device
and the developer cannot access it. Uninstalling the app deletes it.

### 3. Why the app requests network access

The `INTERNET` permission is used to (a) run a local HTTP server on
`127.0.0.1` that loads the UI inside the app, and (b) reach the AI model you
configure yourself, if any. Requests to your model go directly from your device
to that provider; the developer does not proxy, log or store them.

### 4. Third parties

No analytics, ads or social SDKs are bundled. Optional AI features are
bring-your-own-key and governed by the provider's own policy.

### 5. Children

The app does not collect information from children and contains no
child-directed ads or content.

### 6. Changes

Updates to this policy will change the effective date above.

### 7. Contact

`[your email]` — project: <https://github.com/CellMeet/Neotodo>
