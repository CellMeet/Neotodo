# 把 NeoTodo 上架到安卓应用商店

这份清单按顺序做就行：先把**签名**和**安装包**准备好，再上 Google Play（
国际），最后上国内商店（华为 / 小米 / OPPO / vivo / 应用宝等）。

工程在 `NeoTodo-Android/`，源码和 Linux 版共用；上架只需要动这个文件夹和
`store/` 里的素材。

---

## 0. 先搞清楚现状

| 项目 | 当前值 | 上架要求 |
| --- | --- | --- |
| 包名 | `io.github.neotodo` | 一旦发布就不能改，想改现在就改 |
| 版本 | `versionCode 1` / `versionName 0.0.1` | 每次上传 `versionCode` 必须 +1 |
| targetSdk | 35 | 2026-08-31 起 Google Play 只收 target API 36+ 的新应用/更新 |
| 签名 | 无上传密钥，release 回落到 debug 签名 | **必须**用固定的上传密钥，debug 签名会被拒 |
| 64 位 | 已带 `arm64-v8a` | 已满足 |
| 权限 | 只有 `INTERNET` | 越少越好，当前很干净 |

要补的（按优先级）：

1. **上传密钥 + release 构建**（下面第 1、2 步）。
2. **targetSdk 提到 36（现在就必须）**：Google Play 从 2026-08-31 起只接受
   target API 36 及以上的新应用和更新，延期到 2026-11-01 的申请窗口也已经
   过了。装好 `platforms;android-36` 后把 `NeoTodo-Android/app/build.gradle`
   里的 `compileSdk` / `targetSdk` 改成 36，重新构建并回归测试。
3. **16 KB 页大小**：targetSdk 35+ 的应用要在 64 位设备上支持 16 KB 内存页；
   2027-02-01 起 Google Play 不再发布不支持 16 KB 的更新。Chaquopy 的
   `libpython3.12.so` 等 so 需要是 16 KB 对齐的版本，用较新的 Chaquopy
   （16.x 及以上）并跑一次 `zipalign -c -P 16 -v 4 app-release.apk` 验证。
4. ~~自适应图标~~ 已加：`res/mipmap-anydpi-v26/ic_launcher.xml`（前景线稿 +
   纸色背景），Android 8+ 不会再裁掉方形图标的白边。
5. **隐私政策网址**：`store/privacy-policy.md` 已经写好，传到 GitHub Pages
   或任意可公开访问的 HTTPS 页面，两家商店都要填这个链接。

---

## 1. 生成上传密钥（只做一次）

```sh
cd NeoTodo-Android
keytool -genkeypair -v \
  -keystore neotodo-upload.jks \
  -alias neotodo \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -dname "CN=NeoTodo, OU=Mobile, O=NeoTodo, L=Shanghai, ST=Shanghai, C=CN"
```

然后：

```sh
cp keystore.properties.example keystore.properties
# 把 storePassword / keyPassword 改成你刚才输入的密码
```

- `keystore.properties` 和 `*.jks` 已经在 `.gitignore` 里，**不会**被推到
  GitHub。
- **把 `neotodo-upload.jks` 和密码备份到两三个地方**（密码管理器 + 邮箱 +
  离线盘）。丢了就再也无法给同一个包名发更新，只能换包名重新上架。
- 国内商店多数要你上传签名的 APK，Google Play 用的是 AAB + Play App
  Signing（上传密钥丢了还能找 Google 重置，但仍建议备份）。

## 2. 构建上架包

```sh
cd NeoTodo-Android
./build-release.sh              # -> ../NeoTodo-Android-release.aab（Google Play）
./build-release.sh --apk        # 再给一个 ../NeoTodo-Android-release.apk（国内商店）
```

构建前会先跑 `sync-sources.sh`，把根目录最新的 `app.py` / `startup.py` /
`web/` 拷进来，所以**先确认 Linux 版是你想要发布的版本**。

发版前自查：

```sh
# 签名对不对（应该显示你的 alias，不是 Android Debug）
$ANDROID_HOME/build-tools/35.0.0/apksigner verify --print-certs \
  ../NeoTodo-Android-release.apk | head -5

# 16 KB 对齐（targetSdk 35+ 的 64 位包，2027-02 起强制）
$ANDROID_HOME/build-tools/35.0.0/zipalign -c -P 16 -v 4 \
  ../NeoTodo-Android-release.apk | tail -3
```

`build.gradle` 里每次发版改：

```gradle
versionCode 2        // +1
versionName "0.0.2"  // 给人看的版本号
```

---

## 3. Google Play（国际）

### 3.1 账号

1. 用 Google 账号登录 <https://play.google.com/console>，支付 **25 美元**
   一次性注册费。
2. 选**个人**还是**组织**：个人账号需要上传身份证件、地址证明；组织需要
   D-U-N-S 编号。国内个人开发者通常选个人。
3. 2024 年之后的**个人**开发者账号，正式发布前必须跑完**封闭测试**：
   至少 **12 名测试者连续测试 14 天**（测试者要用真实 Google 账号加入，
   不能是开发者自己）。组织账号没有这条，但审核更看重资质。
4. 账号里补全「付款资料」和「开发者资料」——商店页会公开开发者名称和邮箱。

### 3.2 创建应用

1. Play Console → 所有应用 → **创建应用**：名称 `NeoTodo`，默认语言
   `中文（简体）`，类型「应用」，免费。
2. 左侧「测试和发布 → 测试 → 封闭测试」→ 创建新版本 → 上传
   `NeoTodo-Android-release.aab`。
3. 发布说明（release notes）写中文即可，例如
   「首个版本：待办、子任务、笔记、插件工作台」。

### 3.3 商店资料（`store/` 里已提供）

| 需要的东西 | 要求 | 文件 |
| --- | --- | --- |
| 应用图标 | 512×512 PNG（32 位） | `store/icon-512.png` |
| 特色图片 | 1024×500 PNG/JPG | `store/feature-graphic-1024x500.png` |
| 手机截图 | 2–8 张，最短边 ≥ 320px，16:9 或 9:16 | **要自己截**（见下） |
| 7 寸 / 10 寸平板截图 | 各 2 张（应用支持平板时） | 要自己截 |
| 应用名称 | ≤ 30 字 | `store/listing-zh.md` |
| 简短说明 | ≤ 80 字 | `store/listing-zh.md` |
| 完整说明 | ≤ 4000 字 | `store/listing-zh.md` |
| 隐私政策 | 公开 HTTPS 网址 | `store/privacy-policy.md` |

截图建议：先把 App 装到手机或模拟器上，用「分类列表 + 卡片叠放」「笔记 /
AI 面板打开」「完成动画」「插件面板」四五个画面，`adb exec-out screencap -p
> shot.png` 直接截图，不需要后期加字。

### 3.4 各种合规表单（都在「政策 → 应用内容」里）

- **隐私政策**：填上你的网址。
- **应用访问权限**：全部内容无需登录即可使用 → 选「所有功能均可直接使用」。
- **广告**：没有广告 → 否。
- **内容分级**：问卷如实填（工具类、无暴力/成人内容），会得到 3+ 或
  全年龄分级。
- **目标受众**：13 岁以上 / 18 岁以上（不要勾选儿童，否则要过 Families
  政策）。
- **新闻应用**：否。**COVID 接触追踪**：否。**数据安全**：见下。
- **政府应用**：否。**金融功能**：否。

### 3.5 数据安全（Data safety）怎么填

NeoTodo 的实际行为可以直接照抄：

- 是否收集或共享用户数据：**否**（不收集，不上传；没有账号、统计、广告
  SDK）。
- 数据是否加密传输：**不适用**（不传输任何用户数据）。
- 用户是否可以要求删除数据：**不需要**，所有数据都在本机，卸载即删除。
- 应用内是否有第三方 AI 服务：AI 面板需要用户自己配置的本地 CLI / 自己
  的 API Key；**不要**在商店描述里承诺手机端的 AI 功能可用（APK 里没有
  打包 `opencode` CLI，AI 终端在手机上默认不可用）。

### 3.6 提交审核

1. 封闭测试 → 上传 AAB → 添加测试者邮箱列表 → 发布。
2. 12 名测试者接受邀请并保持 14 天后，「正式版」才会解锁。
3. 正式版 → 创建版本 → 上传同一个 AAB → 提交审核。
4. 首次审核一般 1–7 天（新账号可能更久）。之后每次更新通常几小时到 2 天。

### 3.7 常见被拒原因（提前避开）

- AAB 是 **debug 签名** → 必须用第 1 步的上传密钥。
- `versionCode` 重复 → 每次 +1。
- targetSdk 低于当前要求 → 提到 36。
- 16 KB page size 不支持（Android 15+ 设备）→ 见第 0 节。
- 商店页截图里出现其他平台/设备的 UI 元素。
- 描述里出现「最」「第一」「永久免费」等绝对化用语，或者承诺 AI 能力。
- 数据安全表单和实际行为不一致（比如其实有联网分析）。
- 隐私政策网址打不开、不是 HTTPS、内容和应用不符。

---

## 4. 国内应用商店

国内是**一家一家单独上架**，没有统一入口，但材料和流程高度相似。

### 4.1 前置资质（最花时间，先办）

1. **APP 备案（工信部）**：2023 年起所有在国内分发的 App 都要备案。通过
   你的服务器/云厂商（阿里云、腾讯云等）的备案系统提交：App 名称、包名、
   签名 MD5/SHA1、平台（Android）、主体信息。需要先有 **ICP 备案的域名**。
   一般 1–20 个工作日。
2. **软件著作权证书（软著）**：华为、小米、OPPO、vivo、应用宝基本都要，
   个人也能申请，官方通道免费（审核 30–60 天），加急代理几百到一千多。
3. **隐私政策**：公开 HTTPS 网址 + 必须能在 App 内打开（很多商店会检查
   App 内是否有隐私政策入口；没有入口会被拒，可以考虑在设置里加一行
   链接）。
4. **营业执照**：企业主体更好过审；个人开发者能上架，但部分商店限制
   分类、要求手持身份证照片。
5. **测试账号**：本 App 不需要登录，填「无需账号」即可。

### 4.2 各家入口

| 商店 | 开发者后台 | 主要提交物 | 备注 |
| --- | --- | --- | --- |
| 华为 AppGallery | <https://developer.huawei.com/consumer/cn/> | APK 或 AAB、软著、备案号 | 审核较严，隐私政策要能在 App 内打开 |
| 小米应用商店 | <https://dev.mi.com/> | APK、软著、备案号 | 需要小米账号实名 |
| OPPO 开放平台 | <https://open.oppomobile.com/> | APK、软著、备案号 | 首次审核 1–3 天 |
| vivo 开放平台 | <https://dev.vivo.com.cn/> | APK、软著、备案号 | 同上 |
| 腾讯应用宝 | <https://app.open.qq.com/> | APK、软著、备案号 | 需要 QQ 互联主体 |
| 百度手机助手 | <https://app.baidu.com/> | APK、软著 | 流量较小 |
| 阿里应用分发 | <https://open.uc.cn/> | APK、软著 | 流量较小 |

### 4.3 提交流程（每家都一样）

1. 注册开发者 → 实名认证（个人：身份证 + 人脸；企业：营业执照 + 对公
   打款验证）。
2. 创建应用 → 填包名 `io.github.neotodo` → 上传签名 APK（或 AAB）。
3. 上传素材：图标 512×512、截图 3–5 张（1080×1920 最稳）、应用简介。
4. 填隐私政策网址、权限说明（只有网络权限，说明「仅用于本机界面」）、
   备案号、软著号。
5. 提交审核 → 一般 1–7 个工作日，被拒会给出具体理由，改完重新提交。

### 4.4 国内常见被拒原因

- 没有 APP 备案号 / 备案主体和开发者不一致。
- 隐私政策里没写清楚收集哪些信息、怎么删除；或者 App 内找不到隐私政策。
- 首次启动没有隐私弹窗（**这个最容易中**）。国内商店普遍要求：首次打开
  先弹隐私政策，用户点「同意」后才能进入主界面。目前 App 没有这个弹窗，
  上架国内商店前需要加一个。
- 图标/截图里出现其他应用商店的标识。
- 应用名称含「最」「第一」等极限词。

> 建议顺序：先上 Google Play 跑通签名和构建，再办国内资质（备案 + 软著
> 要等），最后批量提国内商店。

---

## 5. 每次发版的固定流程

```sh
# 1. 先在 Linux 上确认功能没问题
./run.sh

# 2. 更新安卓快照
cd NeoTodo-Android
./sync-sources.sh

# 3. 改 versionCode / versionName
$EDITOR app/build.gradle

# 4. 构建
./build-release.sh --apk

# 5. 自测安装
adb install -r ../NeoTodo-Android-release.apk

# 6. 上传到各商店后台，写发布说明
```

## 6. 常见问题

- **能不能不办软著？** 部分商店（尤其 Google Play）不要求；国内主流商店
  基本都要，先用「受理通知书」也能提交。
- **能不能只发 APK？** Google Play 现在只收 AAB（新应用）；国内商店两种
  都收，APK 更通用。
- **签名换了会怎样？** 同一个包名换了签名，已安装用户无法覆盖升级，商店
  也会拒绝更新。所以第 1 步的 keystore 一定要备份。
- **改包名行不行？** 未发布前随便改；发布后改包名等于新应用，用户和评论
  全部清零。
- **iOS / macOS 怎么办？** 见 `docs/platform-sync.md`；各平台各自一份快照。
