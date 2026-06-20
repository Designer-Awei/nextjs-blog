# Next.js 个人博客

基于 Next.js 16 构建的个人博客网站，UI 风格参考苹果官网 — 极简、留白、精致排版。

## 功能

- **首页** — Hero 个人介绍、关于我区块、精选文章
- **文章列表** — 按时间排序的全部文章
- **文章详情** — 结构化内容渲染，支持标题、段落、引用与代码块
- **Mock 数据** — 作者信息与文章数据均为本地 mock，便于后续替换为 CMS 或 MDX
- **头像上传** — 支持本地上传、圆形裁剪框、拖拽调整位置与缩放，保存至 `public/images/avatar.jpg`

## 技术栈

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 项目结构

```
src/
├── app/                  # 页面路由
│   ├── page.tsx          # 首页
│   ├── articles/         # 文章相关页面
│   └── layout.tsx        # 根布局
├── components/           # UI 组件
├── data/mock/            # Mock 数据
│   ├── author.ts         # 作者信息
│   └── articles.ts       # 文章数据
├── lib/                  # 工具函数
└── types/                # TypeScript 类型定义
```

## 自定义内容

编辑以下文件即可修改博客内容：

- `data/author.json` — 个人信息（也可在首页「关于我」区块点击「编辑资料」在线修改）
- `src/data/mock/author.ts` — 默认个人信息（JSON 文件缺失时使用）
- `src/data/mock/articles.ts` — 文章标题、摘要、正文内容

## 构建与部署

```bash
npm run build
npm start
```

可部署至 [Vercel](https://vercel.com)、Netlify 或任何支持 Node.js 的平台。

## License

MIT
