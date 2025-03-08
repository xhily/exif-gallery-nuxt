# EXIF Gallery Nuxt

一个集成了 AI 智能处理、浏览器图片压缩等功能的全栈相册解决方案。

[![部署到 NuxtHub](https://hub.nuxt.com/button.svg)](https://admin.hub.nuxt.com/new)

## 功能特点

- 📷 使用 [`hubBlob()`](http://hub.nuxt.com/docs/storage/blob) 实现图片上传和展示
- 🌐 云存储：由 NuxtHub (cloudflare R2) 提供的 Blob 存储
- 🤖 AI 集成：支持 OpenAI 和 Google AI 进行智能图像处理
- 🗜️ 图片压缩：使用 JSQuash 支持多种格式（JPEG、WebP、AVIF）
- 🎨 现代化 UI：使用 shadcn-vue 和 inspira-ui 构建精美组件
- 🏃🏻 [视图过渡 API](https://developer.chrome.com/docs/web-platform/view-transitions)：提供了一种在更新 DOM 内容的同时轻松创建不同 DOM 状态之间动画过渡的机制
- 🔑 [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)：为 Nuxt 提供 Vue 组合式 API 和服务器工具的轻量级认证模块

## 技术栈

- [NuxtHub](https://hub.nuxt.com) - 用于在边缘构建全栈应用的 Nuxt 工具包
- [UnoCSS](https://unocss.dev/) - 即时按需的原子化 CSS 引擎
- [shadcn-vue](https://www.shadcn-vue.com/) - 使用 Reka UI 和 Tailwind CSS 构建的精美组件
- [inspira-ui](https://inspira-ui.com/) - 用于构建炫酷动画界面的精美 UI 组件集合
- [VueUse](https://github.com/antfu/vueuse) - 实用的 Vue 组合式 API 集合
- [ESLint](https://eslint.org/) 配合 [@nuxt/eslint-config](https://github.com/nuxt/eslint)，使用单引号，无分号
- [TypeScript](https://www.typescriptlang.org/)

## 安装设置

1. 将此仓库克隆到本地机器。
2. 使用命令 `pnpm install` 或你喜欢的包管理器安装依赖。
3. 使用命令 `pnpm dev` 或你喜欢的包管理器运行应用。

> 如果你没有安装 pnpm，运行：`corepack enable pnpm`

## 环境变量

- `NUXT_ADMIN_PASSWORD` - 访问管理面板和上传图片的密码，如果未提供则默认为 `admin`。
- `NUXT_SESSION_PASSWORD` - 用于会话加密的密钥，由 [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils) 使用，在开发模式下如果未提供则会自动生成。
- `NUXT_PUBLIC_TITLE` - 应用的标题，如果未提供则默认为 `Exif Gallery Nuxt`。
- `NUXT_PUBLIC_DESCRIPTION` - 应用的描述，如果未提供则默认为 `A Nuxt.js image gallery template with Exif data support`。

## 开发

```bash
pnpm dev
```

### 远程存储

部署项目后，你可以通过以下命令在本地连接到远程数据库：

```bash
pnpm dev --remote
```

### 部署

你可以使用 [NuxtHub](https://hub.nuxt.com) 免费且零配置地将此项目部署到你的 Cloudflare 账户。

```bash
npx nuxthub deploy
```

也可以利用 Cloudflare Pages CI 进行部署，在 <https://hub.nuxt.com/docs/getting-started/deploy> 了解更多部署选项。

了解更多关于远程存储的信息：<https://hub.nuxt.com/docs/getting-started/remote-storage>

## 模板启动器

这个项目是 NuxtHub 提供的模板启动器，旨在帮助你快速启动 NuxtHub 文件项目。

查看[部署文档](https://hub.nuxt.com/docs/getting-started/deploy)了解更多信息。

## 贡献

欢迎贡献！如果发现 bug 或有功能请求，请通过 pull request 提交 issue。

## 致谢

感谢 [exif-photo-blog](https://github.com/sambecker/exif-photo-blog)
感谢 [nuxt-image-gallery](https://github.com/Flosciante/nuxt-image-gallery)
