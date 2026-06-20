# PRD：文章编辑管理功能

| 项目 | 说明 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-20 |
| 产品名称 | Next.js 个人博客 — 文章管理 |
| 状态 | 已开发 |

---

## 1. 背景与目标

### 1.1 背景

当前博客文章数据硬编码在 `src/data/mock/articles.ts`，无法在线增删改。个人信息已通过 `data/author.json` + 编辑面板实现持久化管理，文章管理需采用相同模式，降低维护成本。

### 1.2 目标

为博客作者提供**可视化文章管理能力**，支持在浏览器内完成文章的创建、编辑、删除，数据持久化到本地 JSON 文件，前台展示实时同步。

### 1.3 非目标（本期不做）

- 用户登录 / 权限鉴权（个人博客，与作者编辑一致，暂不加密）
- MDX / Markdown 文件导入
- 富文本 WYSIWYG 编辑器
- 封面图上传（沿用分类色块占位）
- 多作者协作
- 部署到 Vercel 等只读文件系统（与作者信息相同限制）

---

## 2. 用户角色

| 角色 | 描述 |
|------|------|
| 博客作者 | 站点所有者，负责撰写与管理文章 |

---

## 3. 用户故事

| ID | 用户故事 | 优先级 |
|----|----------|--------|
| US-01 | 作为作者，我希望看到所有文章的列表，以便总览内容 | P0 |
| US-02 | 作为作者，我希望创建新文章，以便发布新内容 | P0 |
| US-03 | 作为作者，我希望编辑已有文章，以便更新内容 | P0 |
| US-04 | 作为作者，我希望删除文章，以便移除过时内容 | P0 |
| US-05 | 作为作者，我希望编辑文章元信息（标题、摘要、分类、标签等） | P0 |
| US-06 | 作为作者，我希望以内容块方式编辑正文（标题/段落/引用/代码） | P0 |
| US-07 | 作为读者，我希望管理后的文章在前台正常展示 | P0 |

---

## 4. 功能需求

### 4.1 文章列表管理页

**路由：** `/articles/manage`

**功能：**

- 展示全部文章（标题、分类、发布日期、阅读时长、标签）
- 按发布日期降序排列
- 操作：编辑、删除、预览（跳转详情页）
- 「新建文章」按钮
- Apple 风格 UI，与现有站点一致

**入口：**

- 文章列表页 `/articles` 右上角「管理文章」链接
- 导航栏暂不新增项（避免读者侧暴露管理入口）

### 4.2 新建文章

- 侧滑编辑面板（与「编辑资料」交互一致）
- 自动生成 slug（基于标题，可手动修改）
- 自动计算阅读时长（基于正文字数，可手动覆盖）
- 默认发布日期为当天
- 至少包含一个段落内容块

### 4.3 编辑文章

- 可修改全部字段：slug、标题、摘要、分类、标签、发布日期、阅读时长、正文内容块
- 修改 slug 时，API 需处理旧 slug 替换
- 保存后刷新列表与前台页面

### 4.4 删除文章

- 点击删除 → 二次确认弹窗
- 确认后从 JSON 移除，不可恢复

### 4.5 内容块编辑

支持四种块类型（与现有 `ArticleBlock` 一致）：

| 类型 | 字段 | 说明 |
|------|------|------|
| `paragraph` | text | 正文段落 |
| `heading` | text | 二级标题 |
| `quote` | text | 引用 |
| `code` | text, language? | 代码块 |

操作：添加块、删除块、上移/下移、切换类型

### 4.6 数据持久化

- 存储路径：`data/articles.json`
- 首次运行：从 `src/data/mock/articles.ts` 默认数据初始化
- 读取时使用 `unstable_noStore`，确保编辑后立即生效
- 相关页面标记 `force-dynamic`

### 4.7 API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles` | 获取全部文章 |
| POST | `/api/articles` | 创建文章 |
| GET | `/api/articles/[slug]` | 获取单篇 |
| PUT | `/api/articles/[slug]` | 更新文章 |
| DELETE | `/api/articles/[slug]` | 删除文章 |

**校验规则：**

- slug：小写字母、数字、连字符，唯一
- title、excerpt：非空
- category：非空
- content：至少 1 个有效内容块
- publishedAt：合法日期格式 `YYYY-MM-DD`
- tags：字符串数组，逗号分隔输入

---

## 5. 数据模型

```typescript
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;      // 本期保留字段，默认占位
  category: string;
  publishedAt: string;     // YYYY-MM-DD
  readTime: number;        // 分钟
  tags: string[];
  content: ArticleBlock[];
}
```

---

## 6. 页面与组件

```
src/app/articles/manage/page.tsx       # 管理页
src/components/articles/
  ArticleManageList.tsx                # 文章列表 + 操作
  ArticleEditorPanel.tsx               # 侧滑编辑器
  ContentBlockEditor.tsx               # 内容块编辑
src/lib/articles.ts                    # 读写 + CRUD
src/lib/article-validation.ts          # 校验与工具函数
src/app/api/articles/route.ts
src/app/api/articles/[slug]/route.ts
data/articles.json
docs/PRD-article-management.md
```

---

## 7. 交互流程

### 创建文章

```
管理页 → 点击「新建文章」→ 侧滑面板 → 填写表单 → 保存
  → POST /api/articles → 写入 JSON → revalidatePath → 刷新列表
```

### 编辑文章

```
管理页 → 点击「编辑」→ 侧滑面板（预填数据）→ 修改 → 保存
  → PUT /api/articles/[slug] → 更新 JSON → 刷新
```

### 删除文章

```
管理页 → 点击「删除」→ 确认弹窗 → DELETE /api/articles/[slug] → 刷新
```

---

## 8. 验收标准

- [x] `/articles/manage` 可访问，展示全部文章
- [x] 可新建文章并在 `/articles/[slug]` 前台查看
- [x] 可编辑文章，前台内容同步更新
- [x] 可删除文章，列表与详情页均不可访问
- [x] 数据写入 `data/articles.json`，重启 dev server 后数据仍在
- [x] 表单校验：空标题、重复 slug 等有明确错误提示
- [x] UI 风格与现有 Apple 风格博客一致

---

## 9. 后续迭代（Out of Scope）

- 管理页密码保护
- Markdown 导入 / 导出
- 封面图上传
- 草稿 / 发布状态
- Supabase 云端存储
