# Solari — Android Release Build & Solana dApp Store Deployment Guide

> 适用平台：Windows + Expo (Bare Workflow) + Solana Mobile dApp Store

---

## 前置条件

- Android Studio 已安装
- JDK 已安装（`keytool` 命令可用）
- Node.js / pnpm 已安装
- Android SDK 已配置（`ANDROID_HOME` 环境变量）

---

## 第一步：生成签名 Keystore

在项目根目录执行（**只需生成一次，妥善保管**）：

```powershell
keytool -genkey -v -keystore polari.keystore -alias polari -keyalg RSA -keysize 2048 -validity 10000
```

填写提示信息时：
- keystore 密码和 key 密码可以设置为相同（按 Enter 使 key 密码等于 keystore 密码）
- 生成后将 `polari.keystore` 移动到 `android/app/keystores/` 目录下

```powershell
New-Item -ItemType Directory -Force android\app\keystores
Copy-Item polari.keystore android\app\keystores\polari.keystore
```

> ⚠️ **安全注意**：永远不要将 keystore 文件提交到 git！确认 `android/.gitignore` 中包含 `keystores/` 或 `*.keystore`。

---

## 第二步：重建 Android 原生目录

> ⚠️ **Windows 路径问题**：在 Windows 上，项目路径**必须尽量短**（建议类似 `C:\Dev\solari\`），否则 CMake/Ninja 编译会因超过 260 字符路径限制而失败。EAS `--local` 模式在 Windows 上也不支持。

```powershell
# 克隆到短路径
git clone <your-repo-url> C:\Dev\solari
cd C:\Dev\solari

# 安装依赖
pnpm install

# 重建 Android 原生代码
npx expo prebuild --clean
```

---

## 第三步：配置签名（在 `android/app/build.gradle`）

按照 [Solana Mobile 官方文档](https://docs.solanamobile.com/dapp-publishing/publishing-a-dapp#configure-your-signing-key) 的要求，在 `android/app/build.gradle` 的 `android {}` 块中添加：

```groovy
android {
    signingConfigs {
        dappStore {
            storeFile file("keystores/polari.keystore")
            storePassword "your_keystore_password"
            keyAlias "polari"
            keyPassword "your_key_password"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.dappStore
        }
    }
}
```

> 💡 建议将密码移入 `gradle.properties`（不提交到 git）以避免硬编码：
> ```properties
> POLARI_STORE_PASSWORD=your_password
> POLARI_KEY_ALIAS=polari  
> POLARI_KEY_PASSWORD=your_password
> ```
> 然后在 `build.gradle` 中引用：`storePassword POLARI_STORE_PASSWORD`

---

## 第四步：执行打包

```powershell
cd C:\Dev\solari\android
.\gradlew assembleRelease
```

> 首次构建耗时较长（10-20 分钟），需下载依赖并编译 C++ 原生模块。

成功后 APK 位于：
```
android\app\build\outputs\apk\release\app-release.apk
```

---

## 第五步：验证签名

```powershell
# 替换为你的 build-tools 版本
$BUILD_TOOLS = "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.1.0"
& "$BUILD_TOOLS\apksigner.bat" verify --print-certs .\app\build\outputs\apk\release\app-release.apk
```

输出中应能看到你的签名证书信息（CN=Ninzainar, OU=SolariApp, ...）。

---

## 第六步：提交到 Solana dApp Store

1. 访问 [https://publish.solanamobile.com](https://publish.solanamobile.com)
2. 登录或注册账户
3. 上传 `app-release.apk`
4. 填写 App 信息（名称、描述、截图等）
5. 提交审核

---

## 常见问题排查

### ❌ EAS `--local` 在 Windows 上不支持
```
Unsupported platform, macOS or Linux is required to build apps for Android
```
**解决**：改用 Gradle 本地构建（本文档方式），或使用 Linux/macOS 环境。

### ❌ `ninja: error: Filename longer than 260 characters`
**原因**：Windows 的 MAX_PATH 限制，Android SDK Ninja 不支持长路径。  
**解决**：将项目移动到更短的路径（如 `C:\Dev\solari\`）。注册表改 `LongPathsEnabled` 对 Ninja 无效。

### ❌ `ninja: manifest 'build.ninja' still dirty after 100 tries`
**原因**：`.cxx` 编译缓存包含旧的绝对路径（通常在移动/复制项目后出现）。  
**解决**：删除所有 `.cxx` 目录后重新构建：
```powershell
# 从项目根目录执行
Get-ChildItem -Recurse -Filter ".cxx" -Directory | Remove-Item -Recurse -Force
```

### ❌ `Tag mismatch`（Gradle 下载依赖失败）
**原因**：Gradle 缓存损坏（下载中断留下残缺文件）。  
**解决**：清除 React Native 相关 Gradle 缓存：
```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches\modules-2\files-2.1\com.facebook.react"
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches\transforms-3"
```

### ❌ Keystore 两个密码的问题
`storePassword` = keystore 文件的密码  
`keyPassword` = 文件内 key 条目的密码  
如果创建时 key 密码按了 Enter，则两者相同，填同一个值即可。

---

## 后续版本更新流程

1. 更新代码，提交 git
2. 更新 `app.json` 中的 `version`，更新 `android/app/build.gradle` 中的 `versionCode`（每次发布必须递增）
3. 在 `C:\Dev\solari\android` 下运行 `.\gradlew assembleRelease`
4. 验证签名
5. 上传新 APK 到 dApp Store

---

## 关键文件清单

| 文件 | 用途 | 提交到 Git |
|------|------|-----------|
| `android/app/keystores/polari.keystore` | 签名密钥 | ❌ 不要提交 |
| `android/gradle.properties` | 包含密码（如使用变量方式） | ❌ 不要提交 |
| `android/app/build.gradle` | 签名配置 | ✅ 可提交（密码用变量引用时） |
| `app.json` | App 版本号 | ✅ 提交 |
