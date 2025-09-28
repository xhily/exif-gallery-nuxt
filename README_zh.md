# EXIF Gallery Nuxt

集成 AI 智能处理、浏览器图片压缩等功能的全栈相册解决方案。

![exif-gallery-nuxt](./public/exif-gallery-nuxt.jpg)

[![部署到 NuxtHub](https://hub.nuxt.com/button.svg)](https://admin.hub.nuxt.com/new)

## 功能特性

- 📷 图片上传与展示，支持 [`hubBlob()`](http://hub.nuxt.com/docs/storage/blob)
- 🌐 云存储：基于 NuxtHub 的 Blob 存储（Cloudflare R2）
- 🤖 AI 集成：支持 OpenAI 和 Gemini 智能图像处理
- 🗜️ 图片压缩：支持多种格式（JPEG、WebP、AVIF），使用 JSQuash 库
- 🎨 现代化界面：采用 shadcn-vue 和 inspira-ui 构建的精美组件
- 🏃🏻 [视图过渡 API](https://developer.chrome.com/docs/web-platform/view-transitions) 提供在不同 DOM 状态间创建动画过渡的机制，同时实现单步 DOM 内容更新
- 🔑 [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils) 提供 Vue 组合式 API 和服务端工具的简约身份验证模块

## 技术栈

- [NuxtHub](https://hub.nuxt.com) - 基于边缘计算构建全栈应用的 Nuxt 工具包
- [UnoCSS](https://unocss.dev/) - 即时按需原子化 CSS 引擎
- [shadcn-vue](https://www.shadcn-vue.com/) - 基于 Reka UI 和 Tailwind CSS 构建的精美组件库
- [inspira-ui](https://inspira-ui.com/) - 用于构建惊艳动画界面的 UI 组件集合
- [VueUse](https://github.com/antfu/vueuse) - 实用组合式 API 集合
- [ESLint](https://eslint.org/) 配合 [@nuxt/eslint-config](https://github.com/nuxt/eslint) - 使用单引号且不带分号的代码规范
- [TypeScript](https://www.typescriptlang.org/)

### 部署说明

使用 [NuxtHub](https://hub.nuxt.com) 可免费部署到 Cloudflare。

1. 确保您已拥有Cloudflare账户并开通R2服务。
2. 将此代码库（Repository） fork 到您的GitHub账户中。
3. 前往 [NuxtHub官网](https://hub.nuxt.com)，使用GitHub账户登录。
4. 点击"Deploy"部署按钮，选择您fork的代码库。
5. 根据需要配置环境变量。

> [!NOTE]
> 如果Github Actions已创建但未自动触发，您可以通过提交新更改（例如修改README.md文件并提交）来手动触发部署。

```bash
npx nuxthub deploy
```

也可通过 Cloudflare Pages CI 部署，更多部署选项请参考：<https://hub.nuxt.com/docs/getting-started/deploy>

远程存储相关文档：<https://hub.nuxt.com/docs/getting-started/remote-storage>

## 环境变量

- `NUXT_ADMIN_PASSWORD` - 管理后台访问密码，未设置时默认为 `admin`
- `NUXT_SESSION_PASSWORD` - [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils) 使用的会话加密密钥，开发环境未设置时将自动生成
- `NUXT_PUBLIC_TITLE` - 应用标题，未设置时默认为 `Exif Gallery Nuxt`
- `NUXT_PUBLIC_DESCRIPTION` - 应用描述，未设置时默认为 `一个集成了 AI 智能处理、浏览器图片压缩等功能的全栈相册解决方案`

## 安装步骤

1. 将本仓库克隆到本地
2. 使用 `pnpm install` 或其他包管理器安装依赖
3. 运行 `pnpm dev` 或其他包管理器启动应用

> 若未安装 pnpm，可运行：`corepack enable pnpm`

## 开发指南

```bash
pnpm dev
```

### 远程存储

部署项目后，可通过以下命令连接远程数据库进行本地开发：

```bash
pnpm dev --remote
```

## 贡献指南

欢迎贡献代码！可通过提交 issue 反馈问题，或通过 pull request 提交新功能。

## 致谢

感谢 [exif-photo-blog](https://github.com/sambecker/exif-photo-blog)
感谢 [nuxt-image-gallery](https://github.com/Flosciante/nuxt-image-gallery)
