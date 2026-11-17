# 软件与插件下载站

这个文件夹是一整站静态网页：**软件下载**（Windows / Linux / macOS / Android / iOS）和
**插件下载**（与 NeoTodo「设置 → 社区」读取的目录是同一份 JSON）。把它传到阿里云
服务器，用 Nginx 直接托管即可，不需要数据库、不需要后端进程。

```
site/
  index.html                 页面（下载卡片 + 插件架 + 安装说明）
  style.css  site.js         纸张主题、深浅色、搜索和系统识别
  downloads.json             版本清单：每个系统、文件名、大小、sha256
  plugins/catalog.json       插件目录（应用也会读这份）
  plugins/icons/*.svg        插件图标（供网页使用）
  assets/icon.svg            站点图标
  releases/                  放安装包/源码包/APK 的地方（构建时复制到 files/）
  build.py                   打包插件 zip、算校验值、生成 dist/
  deploy.sh                  rsync 上传 + nginx 检查
  nginx/neotodo-downloads.conf  Nginx 站点配置
  dist/                      构建产物（上传的就是它，已 gitignore）
```

## 一分钟预览

```sh
python3 site/build.py                 # 生成 site/dist（不写域名也能本地预览）
python3 -m http.server -d site/dist 8080
# 打开 http://localhost:8080
```

`site/build.py --check` 只做校验：JSON 结构、插件图标、Nginx 配置、页面挂载点。

## 部署到阿里云 ECS

### 1. 服务器

- 一台 1 核 1 GB 的 ECS 或轻量应用服务器就够，系统选 **Ubuntu 22.04 / 24.04**。
- 安全组放行 **80** 和 **443**；只用 IP 测试时也可以放行 8080。
- 中国大陆地域的服务器，用域名提供网页服务前需要 **ICP 备案**；没备案时阿里云会拦截
  80/443 上的域名访问，可以先用 `http://服务器IP:8080` 或选择香港/海外地域。

### 2. 安装 Nginx

```sh
ssh root@你的服务器IP
# Ubuntu / Debian
apt update && apt install -y nginx rsync
# Alibaba Cloud Linux / CentOS
# dnf install -y nginx rsync
systemctl enable --now nginx
mkdir -p /var/www/neotodo-downloads
```

> 阿里云控制台的**安全组**放行 80/443；如果系统里开了 `ufw` 或 `firewalld`，
> 也要放行 http/https（`ufw allow 'Nginx Full'` 或
> `firewall-cmd --permanent --add-service=http --add-service=https`）。

### 3. 本地构建并上传

```sh
# 把安装包、源码包、APK 放进 site/releases/（文件名要和 downloads.json 里一致）
SITE_HOST=root@你的服务器IP \
SITE_BASE_URL=https://dl.example.com \
./site/deploy.sh
```

`deploy.sh` 会：

1. 运行 `build.py --base-url https://dl.example.com`；
2. 把 `site/releases/` 里能对上的文件复制到 `dist/files/`，同时计算大小和 sha256；
3. 把 `web/plugins/` 里的插件打包成 `dist/plugins/files/<id>-<version>.zip`，并把
   `download` / `sha256` 写回 `dist/plugins/catalog.json`；
4. `rsync` 到 `/var/www/neotodo-downloads/`，然后 `nginx -t && systemctl reload nginx`。

不想每次都构建时可以加 `SITE_NO_BUILD=1`；只想看 rsync 会做什么可以加 `DRY_RUN=1`。

### 4. Nginx 站点

```sh
# 在服务器上
sudo cp nginx/neotodo-downloads.conf /etc/nginx/sites-available/neotodo-downloads
sudo sed -i 's/dl.example.com/你的域名/' /etc/nginx/sites-available/neotodo-downloads
sudo ln -sf /etc/nginx/sites-available/neotodo-downloads /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

如果上传后出现 403，通常是权限问题：

```sh
sudo chown -R www-data:www-data /var/www/neotodo-downloads
sudo find /var/www/neotodo-downloads -type d -exec chmod 755 {} \;
sudo find /var/www/neotodo-downloads -type f -exec chmod 644 {} \;
```

### 5. HTTPS（插件安装必须）

应用里的「安装」会从 `download` URL 下载 `.zip`，而 NeoTodo 只接受 **https://** 的
插件地址，所以正式使用时请配好证书。二选一：

```sh
# A. Let's Encrypt（域名已解析到服务器）
apt install -y certbot python3-certbot-nginx
certbot --nginx -d dl.example.com
```

```nginx
# B. 阿里云 SSL 证书：下载 Nginx 格式，上传后取消 nginx 配置里 443 段的注释
ssl_certificate     /etc/nginx/certs/dl.example.com.pem;
ssl_certificate_key /etc/nginx/certs/dl.example.com.key;
```

### 6. 验证

```sh
curl -fsS https://dl.example.com/healthz
curl -fsS https://dl.example.com/plugins/catalog.json | python3 -m json.tool | head -30
curl -fsSI https://dl.example.com/downloads.json | head -1
curl -fsSI https://dl.example.com/plugins/files/hello-paper-1.0.0.zip | head -1
```

浏览器打开 `https://dl.example.com`，应该能看到系统识别、下载卡片和可搜索的插件架。

## 让应用读这台服务器

NeoTodo 的插件目录地址由环境变量 `NEOTODO_PLUGIN_CATALOG` 控制，默认是 GitHub 上的
`community/catalog.json`。把它指到你的服务器即可：

```sh
NEOTODO_PLUGIN_CATALOG=https://dl.example.com/plugins/catalog.json ./run.sh
```

- 应用启动后，社区页会从这个地址刷新目录，并缓存 12 小时；在「设置 → 社区」点
  「刷新目录」可以立即刷新。
- 目录里的 `download` 必须是绝对 `https://` 地址；`build.py --base-url` 已经处理好。
- 应用断网时会退回内置的离线目录，所以服务器不可达不会影响打开笔记本。
- 想长期生效，可以把这行写进启动器或 `~/.profile`，也可以在自己的 `run.sh` 外层包一层。

## 数据格式

`site/downloads.json` 是页面唯一的软件清单，改这个文件就能加系统、换链接：

| 字段 | 说明 |
| --- | --- |
| `app.version` / `app.released` | 页头显示的版本和日期 |
| `platforms[].id` | `windows` / `linux` / `macos` / `android` / `ios`，用于系统识别 |
| `platforms[].status` | `available` 可下载、`build` 需从源码构建、`planned` 制作中 |
| `platforms[].requirements` | 卡片里的要求列表，最多显示 4 条 |
| `platforms[].note` | 一段说明，写安装或数据位置 |
| `artifacts[].file` | 文件名；与 `site/releases/` 同名时会被自动发布并算出 sha256 |
| `artifacts[].url` | 没有本地文件时使用的地址（GitHub Release 或文档链接） |
| `artifacts[].kind` | `exe` / `tar.gz` / `apk` / `link`；`link` 会渲染成说明按钮 |
| `artifacts[].source` | `github` / `server` / `docs`，只影响卡片右上角的小标签 |

`site/plugins/catalog.json` 与 `community/catalog.json` 结构完全一致，应用直接读取它。
正式部署时 `build.py` 会从 `community/catalog.json` 重新生成一份，为每个插件补上
`download` 和 `sha256`，所以不需要手写校验值。

## 发布新版本

1. 把新的安装包放进 `site/releases/`，文件名与 `downloads.json` 的 `file` 一致；
2. 修改 `site/downloads.json` 的 `app.version` / `released` 和对应 `file`（如果文件名带版本号）；
3. 重新运行 `./site/deploy.sh`。

已经用 GitHub Releases 的话，可以直接把附件拉下来再上传：

```sh
gh release download v0.0.2 --pattern 'NeoTodo-*' -D site/releases
./site/deploy.sh        # SITE_HOST / SITE_BASE_URL 照旧
```

插件更新更简单：改 `web/plugins/<id>/manifest.json` 的 `version`，同步
`community/catalog.json`，再跑一次 `deploy.sh`。网页和应用都会看到新版本和新的
sha256，不需要重新发软件。

## 可选：把大文件放到 OSS + CDN

ECS 带宽通常只有 1–5 Mbps，安装包大、下载人一多就会变慢。可以把 `dist/files/` 和
`dist/plugins/files/` 传到 OSS，然后把 `downloads.json` 与插件目录里的地址换成 OSS
或 CDN 域名。OSS 需要开启公共读（或使用签名 URL），并给存储桶配置 CORS
`Access-Control-Allow-Origin: *`。小站点继续直接放 ECS 也完全够用。

## 安全与维护

- 站点没有上传接口、没有数据库、没有 Cookie；`deploy.sh` 只做单向 rsync。
- 插件目录只允许出现审核过的条目；`sha256` 是安装前的完整性校验。
- 访问日志就是下载统计：
  `grep ' /files/' /var/log/nginx/neotodo-downloads.access.log | wc -l`
- 建议每月 `sudo apt update && sudo apt upgrade`，证书到期前续期。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 打开页面一直显示「正在读取版本信息」 | 直接双击 `index.html` 时浏览器不允许 fetch 本地 JSON；用 `python3 -m http.server -d site/dist 8080` 或部署后访问 |
| 插件卡片空白 / 图标缺失 | 运行 `python3 site/build.py --check`，确认 `site/plugins/icons/<id>.svg` 存在 |
| 应用里点安装提示 URL 必须是 https | 插件 `download` 还是 http 或相对路径；用 `--base-url https://…` 重新构建 |
| 下载 404 | `downloads.json` 的 `file` 与 `site/releases/` 里的文件名不一致，或还没重新上传 |
| 域名访问被重置 | 中国大陆服务器未备案，或安全组没放行 80/443 |
| 403 Forbidden | `/var/www/neotodo-downloads` 权限或 SELinux（CentOS 系）问题 |

## 与仓库其他部分的关系

- 插件目录：`community/catalog.json` 是源，`build.py` 读取它并生成服务器版本。
- 插件源码：`web/plugins/<id>/`，打包格式与 `tools/pack-plugin.py` 一致
  （`manifest.json` 位于 zip 根目录）。
- 软件版本清单：`site/downloads.json`，和 README 的下载表格保持同一版本号。
