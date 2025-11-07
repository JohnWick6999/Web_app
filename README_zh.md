# XKCD 漫画浏览器应用

一个现代化的XKCD漫画浏览器应用，提供流畅的用户体验和丰富的交互功能。

## 目录
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [API 接口](#api-接口)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

## 功能特性

### 核心功能
- 📖 浏览XKCD漫画：通过官方API获取并展示XKCD漫画
- 🔍 导航控制：支持首张、上一张、下一张、最新漫画导航
- 🔢 自定义跳转：可以通过输入编号直接跳转到指定漫画
- 💾 数据持久化：使用localStorage保存用户偏好设置

### 用户界面
- 🌗 深色/浅色主题切换：一键切换界面主题并自动保存设置
- 🔍 漫画缩放：支持放大/缩小漫画以获得更好的观看体验
- 🔄 3D交互效果：鼠标悬停时产生立体旋转效果
- 📱 响应式设计：适配各种屏幕尺寸，包括移动端设备
- 📋 漫画列表面板：侧边栏显示漫画列表，便于快速导航

### 社交功能
- ❤️ 点赞系统：为喜欢的漫画点赞，并记录点赞次数
- ℹ️ 附加信息：显示漫画的详细信息，如发布日期、新闻和文字稿

## 技术栈

本项目使用了以下技术和工具：

| 类别 | 技术 |
|------|------|
| 框架 | [Next.js 15](https://nextjs.org/) (App Router) |
| 语言 | [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/), CSS Modules |
| 字体 | [Geist Font Family](https://vercel.com/font) |
| 构建工具 | Turbopack |
| 包管理 | npm |

## 项目结构

```
xkcd-viewer/
├── app/                    # 应用程序源码
│   ├── api/               # API路由
│   │   └── xkcd/
│   │       └── [comicId]/ # 漫画API端点
│   │           └── route.ts
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页组件
├── public/                # 静态资源
├── types/                 # TypeScript类型定义
│   └── xkcd.ts           # XKCD漫画数据接口
├── README.md             # 项目说明文档
├── next.config.ts        # Next.js配置文件
├── tailwind.config.ts    # Tailwind配置文件
└── tsconfig.json         # TypeScript配置文件
```

## 快速开始

### 环境要求
- Node.js 18.17 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd xkcd-viewer
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 开发指南

### 组件架构

主应用组件位于 [app/page.tsx](./xkcd-viewer/app/page.tsx)，它包含了所有UI逻辑和状态管理：

- **状态管理**：使用React原生useState和useReducer进行状态管理
- **副作用处理**：通过useEffect处理组件生命周期事件
- **数据获取**：使用fetch API调用内部API路由获取漫画数据

### 样式系统

项目采用Tailwind CSS和自定义CSS相结合的方式：

- 全局样式定义在 [app/globals.css](./xkcd-viewer/app/globals.css)
- 响应式设计通过Tailwind的断点系统实现
- 深色模式通过CSS变量和类名切换实现

### 主题切换

应用支持深色和浅色主题：

1. 用户点击主题切换按钮时会切换主题
2. 用户偏好设置保存在localStorage中
3. 页面加载时会检查并应用保存的主题设置

### 3D交互效果

漫画图像具有3D交互效果：

1. 鼠标在漫画上移动时会产生旋转效果
2. 点击"Zoom In"按钮可以放大漫画
3. 所有效果都是通过CSS transform属性实现

## API 接口

### 获取漫画数据

```
GET /api/xkcd/[comicId]
```

参数：
- `comicId`: 漫画ID或者"latest"表示最新漫画

响应示例：
```json
{
  "month": "10",
  "num": 2999,
  "link": "",
  "year": "2025",
  "news": "",
  "safe_title": "Future Tech",
  "transcript": "",
  "alt": "In the future, all tech support will be handled by AI that speaks only in haikus.",
  "img": "https://imgs.xkcd.com/comics/future_tech.png",
  "title": "Future Tech",
  "day": "15"
}
```

## 部署

### Vercel (推荐)

由于本项目基于Next.js，最简单的部署方式是使用[Vercel](https://vercel.com/new)：

1. 将代码推送到GitHub/GitLab/Bitbucket
2. 在Vercel中导入项目
3. 设置环境变量（如果需要）
4. 点击部署

### 其他平台

也可以部署到其他支持Node.js的平台：

```bash
# 安装依赖
npm install

# 构建应用
npm run build

# 启动生产服务器
npm run start
```

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

### 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 使用TypeScript编写类型安全的代码
- 遵循项目现有的代码风格
- 添加适当的注释说明复杂逻辑
- 确保所有测试通过

## 许可证

本项目仅供学习和参考使用。

---

由 Peter Sun 创建，特别感谢 Tim 的指导。