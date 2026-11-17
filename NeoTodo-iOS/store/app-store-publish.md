# NeoTodo 上架 App Store 指南

这份文档把 NeoTodo（iOS 版）从「Xcode 里能跑」带到「App Store 上能下载」，
包括中国大陆区额外要准备的材料。

> 先在 Mac 上完成 [`README.md`](../README.md) 的构建步骤，确认模拟器里能正常
> 打开、新建分类、写笔记，再开始走下面的流程。上架只需要一台安装 Xcode 的
> Mac，Linux 上无法打包 iOS。

---

## 0. 你需要准备什么

| 项目 | 说明 | 费用 |
| --- | --- | --- |
| Apple Developer Program | 个人或公司账号，上架、TestFlight、真机签名都要它 | US$99 / 年 |
| Mac + Xcode 15+ | 打包、上传、截图 | 免费（设备自备） |
| XcodeGen | `brew install xcodegen`，用来生成 `.xcodeproj` | 免费 |
| 隐私政策网页 | App Store Connect 必填字段，必须是一个可访问的网址 | 免费（GitHub Pages 即可） |
| 中国大陆区备案号 | 只在中国大陆区上架才需要（见第 9 节） | 免费，但需要时间 |

个人开发者账号在 App Store 上显示的是**个人姓名**；公司账号显示公司名。想用
公司名义，需要营业执照 + D-U-N-S 编号，审核 1～2 周。个人账号通常当天就能开通。

---

## 1. 注册 Bundle ID（App 身份证）

1. 打开 [developer.apple.com](https://developer.apple.com) → **Certificates,
   Identifiers & Profiles** → **Identifiers** → **＋**。
2. 选 **App IDs → App**，Description 填 `NeoTodo`，Bundle ID 选 *Explicit*，
   填：

   ```
   io.github.neotodo
   ```

   如果想和 Android 区分，可以改成 `io.github.neotodo.ios`。改完要同步修改
   `project.yml` 里的 `PRODUCT_BUNDLE_IDENTIFIER`，两边必须一致。

3. Capabilities 一个都不用勾（本 App 不用推送、不用 iCloud、不用
   App Groups）。
4. 保存。

> 用 Xcode 的自动签名时，这一步可以省略——Xcode 会在第一次真机运行时自动创建
> App ID。但提前建好更省事，名字也不会被抢。

---

## 2. 在 App Store Connect 创建 App

1. 打开 [appstoreconnect.apple.com](https://appstoreconnect.apple.com) →
   **我的 App** → **＋** → **新建 App**。
2. 填写：

   | 字段 | 填什么 |
   | --- | --- |
   | 平台 | iOS |
   | 名称 | `NeoTodo`（全球唯一，被占用就换 `NeoTodo 待办笔记`） |
   | 主要语言 | 简体中文（或 English） |
   | Bundle ID | 第 1 步建的那个 |
   | SKU | 任意内部编号，例如 `neotodo-ios-001` |
   | 用户访问权限 | 完全访问 |

3. 创建后先别急着填全部内容，等打包上传后再回来填元数据。

---

## 3. 签名：让 Xcode 自己管

1. `./Scripts/generate-project.sh` 生成工程，`open NeoTodo.xcodeproj`。
2. 选中 **NeoTodo** target → **Signing & Capabilities**：
   - 勾选 **Automatically manage signing**
   - **Team** 选你的 Apple ID / 团队
   - Bundle Identifier 与第 1 步一致
3. 真机调试前，在 iPhone 上打开 **设置 → 隐私与安全性 → 开发者模式**。
4. 第一次运行如果提示「不受信任的开发者」，在 iPhone 的 **设置 → 通用 →
   VPN与设备管理** 里信任你的开发者证书。

自动签名会帮你创建 *Apple Development* 和 *Apple Distribution* 证书以及
描述文件，不需要去开发者后台手动下载。

---

## 4. 打包出 .ipa

```sh
# TEAM_ID 在 App Store Connect → 会员资格 页面，形如 ABCDE12345
TEAM_ID=ABCDE12345 ./Scripts/archive.sh
```

脚本做三件事：

1. `xcodebuild archive` 生成 `build/NeoTodo.xcarchive`；
2. 用 `build/ExportOptions.plist`（脚本自动生成）导出 App Store 包；
3. 输出 `build/export/NeoTodo.ipa`。

也可以完全用 Xcode 图形界面：**Product → Archive** →
**Distribute App → App Store Connect → Upload**。

打包前建议改版本号：`project.yml` 里的 `MARKETING_VERSION`（用户看到的
`0.1.0`）和 `CURRENT_PROJECT_VERSION`（内部构建号，每次上传必须更大）。

---

## 5. 上传到 App Store Connect

三种方式，选一种：

**A. Transporter（最省事）**

Mac App Store 搜索安装 **Transporter**，登录 Apple ID，把
`build/export/NeoTodo.ipa` 拖进去，点「交付」。

**B. 命令行 + API Key**

1. App Store Connect → **用户和访问** → **集成** → **App Store Connect API**
   → 生成密钥，记下 **Key ID** 和 **Issuer ID**，下载 `.p8` 文件（只能下载一次）。
2. 上传：

   ```sh
   xcrun altool --upload-app -f build/export/NeoTodo.ipa -t ios \
     --apiKey "$ASC_KEY_ID" --apiIssuer "$ASC_ISSUER_ID"
   ```

**C. Xcode Organizer**

Archive 完成后在 Organizer 里点 **Distribute App**，一路下一步。

上传后 5～30 分钟，构建版本会出现在 App Store Connect → 你的 App →
**TestFlight** 里。状态变成「处理完成」才能提交审核。

---

## 6. 用 TestFlight 先自己试

1. App Store Connect → **TestFlight** → **内部测试** → 添加你自己。
2. iPhone 上装 **TestFlight**，接受邀请，安装 NeoTodo。
3. 重点检查（模拟器和真机行为可能不同）：
   - 首次启动的加载页与淡出；
   - 长按卡片 / 子任务是否弹出右键菜单；
   - 笔记里的图片能不能从相册选；
   - 壁纸从相册选择后是否生效；
   - 切到后台再回来，数据还在；
   - 横屏、iPad 分屏（如果支持）。

内部测试最多 100 人，不需要审核；外部测试需要 Apple 先审核一版。

---

## 7. 填写商店信息

App Store Connect → 你的 App → **App 信息** / **版本信息**：

| 字段 | 建议 |
| --- | --- |
| 副标题（30 字符） | `本地优先的待办与笔记` |
| 描述 | 见 [`listing-zh.md`](listing-zh.md) |
| 关键词（100 字符，逗号分隔） | `待办,清单,任务,笔记,子任务,效率,GTD,番茄钟,本地,离线` |
| 支持网址 | 你的 GitHub 仓库或帮助页 |
| 营销网址（可选） | 项目主页 |
| 隐私政策网址 | **必填**，把 [`privacy-policy.md`](privacy-policy.md) 放到 GitHub Pages 后填链接 |
| 版权 | `2026 你的名字` |
| 分类 | 效率（主要）/  productivity |
| 年龄分级 | 4+（无用户生成内容公开、无广告） |
| 价格 | 免费（无内购） |

### 截图（必须自己截）

App Store 要求至少一组，尺寸必须精确（用模拟器截图最稳）：

| 设备 | 分辨率 |
| --- | --- |
| iPhone 6.9"（15 Pro Max / 16 Pro Max） | 1320 × 2868 |
| iPhone 6.5"（11 Pro Max / XS Max） | 1284 × 2778 |
| iPad 13"（若支持 iPad） | 2064 × 2752 |

模拟器里 `⌘S` 保存到桌面，或：

```sh
xcrun simctl io booted screenshot shot-1.png
```

建议 6 张：分类卡片 → 子任务展开 → 笔记面板 → 完成任务动画 → 插件面板 →
主题设置。

---

## 8. App 隐私、出口合规与审核备注

**App 隐私（App Privacy）**

- 选择 **不收集数据（Data Not Collected）**。
- 理由：没有账号、没有统计 SDK、没有广告；任务与笔记只存在设备上。AI 面板是
  可选功能，用户配置的接口由用户自己的 Key 直接访问，开发者拿不到任何数据。
- `NeoTodo/Resources/PrivacyInfo.xcprivacy` 已随包声明「不追踪、不收集」，并
  申报了文件时间戳 / 磁盘空间 / 启动时间这三个 required-reason API 的用途。

**出口合规（Export Compliance）**

- `Info.plist` 里已写 `ITSAppUsesNonExemptEncryption = false`：App 只用系统
  TLS，属于豁免范围。上传时不再询问。

**审核备注（App Review Information → Notes）** 建议贴这段：

```
NeoTodo is a local-first notebook. The interface is a bundled HTML workspace
served to the app's own WKWebView from 127.0.0.1; no traffic leaves the device.
The embedded CPython runtime runs only the signed backend bundled in the app.
No executable code is downloaded at runtime; community themes and plugins are
data and JavaScript interpreted by WebKit. Tasks, notes and settings are stored
only in the app container. No account or login is required.
```

---

## 9. 中国大陆区额外要求（只在国区上架需要）

1. **App 备案号**：2023 年 9 月起，工信部要求在中国大陆区上架的 App 提供
   备案号。通过 App Store Connect 的「App 信息 → 中国大陆」填写；备案在
   你购买服务器/域名服务商或各省通信管理局的 App 备案系统办理，通常需要
   1～4 周。
2. **软著（计算机软件著作权）**：App Store 本身不强制，但国内应用商店（华为、
   小米、OPPO 等）上架时普遍要求；只上 App Store 可以先不办。
3. **内容合规**：本项目无社区服务器、无用户公开发布内容，风险很低；如果以后
   加了「社区」在线功能，需要额外准备内容审核机制。
4. **隐私政策必须是可访问的网页**，建议中英双语。

---

## 10. 提交审核与发布

1. 版本信息填完 → 选择第 5 步上传的构建版本 → **添加以供审核**。
2. 回答「加密」「广告标识符（IDFA）」等问题：**不使用 IDFA**。
3. 点 **提交**。首次审核通常 24～72 小时，被拒会收到具体条款。
4. 通过后可以选**手动发布**（自己去点「发布」）或**自动发布**。
5. 后续更新：改 `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` → 重新
   `./Scripts/archive.sh` → 上传 → 提交审核。

---

## 11. 常见拒审原因与应对

| 条款 | 审核员可能说什么 | 怎么答 / 怎么改 |
| --- | --- | --- |
| **4.2 Minimum Functionality** | 「像一个网页壳」 | 说明本地后端、离线数据、主题/插件、长按菜单都是原生 WKWebView + Python 实现；附上操作视频 |
| **2.5.2 Executable code** | 「内嵌了解释器」 | 解释 Python 只运行应用包内已签名代码，不下载可执行代码；插件是 WebKit 解释的 JS |
| **2.5.1 私有 API** | 极少见 | 不要用私有 API；本项目只用公开 UIKit/WebKit 接口 |
| **5.1.1 隐私** | 「需要隐私政策」 | 填好隐私政策网址；确认 App 隐私标签与 `PrivacyInfo.xcprivacy` 一致 |
| **2.1 崩溃 / 白屏** | 审核设备上启动失败 | 用 Release 包在真机（不是模拟器）走一遍；检查 `python/` 是否被打进包 |
| **4.3 Spam** | 与已有 App 过于相似 | 说明这是同一个开源项目的 iOS 版本，附仓库链接 |
| **账号删除** | 若以后加账号系统才需要 | 当前无账号，不涉及 |

如果被拒，在 App Store Connect 的 **App 审核** 里回复审核员并说明，必要时
重新提交，不需要重新付费。

---

## 12. 上架后

- 保留一份 `TEAM_ID`、API Key 和 `build/` 产物，方便下次更新。
- 每次发布后把本文件的「版本 / 构建号」更新到 [`listing-zh.md`](listing-zh.md)。
- iOS 版本与 Linux / macOS / Android 共用同一套 `app.py` 与 `web/`；Linux 的
  改动要进 iOS，先在根目录提交，再在 `NeoTodo-iOS/` 里跑
  `./sync-sources.sh`，然后重新打包。

---

## 一页检查清单

- [ ] Apple Developer Program 已开通并签署协议
- [ ] Bundle ID `io.github.neotodo` 已创建
- [ ] App Store Connect 已建 App 记录
- [ ] Xcode 签名选好 Team，真机跑通
- [ ] `./Scripts/fetch-python.sh` 已执行
- [ ] `TEAM_ID=... ./Scripts/archive.sh` 生成 `.ipa`
- [ ] Transporter / altool 上传成功，TestFlight 可安装
- [ ] 截图（6.9"、6.5"，iPad 若支持）已上传
- [ ] 隐私政策网址可访问
- [ ] App 隐私 = 不收集数据
- [ ] 出口合规 = 使用豁免加密（已写在 Info.plist）
- [ ] 审核备注已填写（本地服务 + 内嵌解释器说明）
- [ ] 中国区备案号（仅国区）
- [ ] 提交审核 → 通过 → 发布
