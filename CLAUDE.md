# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefly is a feature-rich static blog theme built on **Astro 6** with **Svelte 5** for interactive components. It's a fork of [Fuwari](https://github.com/saicaca/fuwari) extended with extensive features. Primary language is Chinese (Simplified) with i18n for en, zh_TW, ja, ru.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build (icons → LQIPs → Astro build → Pagefind indexing) |
| `pnpm preview` | Preview production build |
| `pnpm check` | `astro check` for type/error checking |
| `pnpm type-check` | `tsc --noEmit --isolatedDeclarations` |
| `pnpm lint` | Biome lint + auto-fix |
| `pnpm format` | Biome format |
| `pnpm new-post <filename>` | Scaffold a new blog post |

Package manager is **pnpm** (enforced). Node.js >= 22 required.

## Architecture

### Astro + Svelte Hybrid

- `.astro` components for static content and layouts
- `.svelte` components for interactive UI (search, settings, pagination, archive) — mounted with `client:load` or `client:visible`
- Swup.js handles SPA-like page transitions with multiple container targets

### Configuration-Driven

All features are toggled/configured via TypeScript files in `src/config/`, exported through the barrel at `src/config/index.ts`. Key configs:

- `siteConfig.ts` — core site settings, theme, pagination
- `sidebarConfig.ts` — sidebar layout (left/right/both, widget ordering)
- `commentConfig.ts`, `analyticsConfig.ts`, `fontConfig.ts`, etc.

### Layout System

- `Layout.astro` — base HTML shell (head, body, theme init, analytics, Swup hooks)
- `MainGridLayout.astro` — full page grid with sidebar(s), navbar, wallpaper, footer

### Content Collections

Defined in `src/content.config.ts`:
- `posts` — blog posts (`.md`/`.mdx`) with frontmatter: title, published, tags, category, draft, pinned, password, comment, etc.
- `spec` — special pages (about, guestbook)

### Key Directories

- `src/components/` — organized by domain: `analytics/`, `comment/`, `common/`, `controls/`, `features/`, `layout/`, `misc/`, `pages/`, `widget/`
- `src/plugins/` — 15 custom remark/rehype plugins (Mermaid, PlantUML, KaTeX, GitHub cards, reading time, etc.)
- `src/i18n/` — translation keys in `i18nKey.ts`, language files in `languages/*.ts`, lookup via `translation.ts`
- `src/utils/` — content sorting, crypto (encrypted posts), date formatting, image processing/LQIP, TOC generation
- `src/pages/` — Astro file-based routing
- `scripts/` — build-time utilities (`generate-icons.js`, `generate-lqips.ts`, `new-post.js`)

### Path Aliases (tsconfig.json)

`@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@i18n/*`, `@layouts/*` → `./src/<dir>/*`; `@/*` → `./src/*`

## Code Style

- **Biome** enforces: tab indentation, double quotes, recommended lint rules
- Relaxed rules for `.svelte`/`.astro` files (useConst off, noUnusedVariables off)
- Commit convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.)

## Build Pipeline

Multi-step: `scripts/generate-icons.js` → `scripts/generate-lqips.ts` → `astro build` → `pagefind --site dist`

Icons/LQIP data are generated into `src/constants/` and committed. Regenerate with `pnpm icons` or `pnpm lqips`.

## Deployment

- **Vercel** (default, `vercel.json`)
- **Cloudflare Workers** (`wrangler.jsonc`, set `CF_WORKERS` env var)
- Static output to `dist/`

---

## 迁移上下文 (2026-06-24)

### 项目来源

当前项目是从旧版站点 [raynardsblog](../blog/raynardsblog/) 升级而来的 Firefly v6.13.0。

| | 旧版 | 新版 |
|---|---|---|
| 路径 | `V:\blog\raynardsblog` | `V:\newastroblog\Firefly` |
| 版本 | v6.10.3 (Astro 6.3.1) | **v6.13.0 (Astro 7.0.0)** |
| 部署 | Cloudflare Workers | Cloudflare Workers |
| Worker 名 | `raynardsblog` | 已设置为 `raynardsblog` |

### 两版核心差异（非开关/文章类）

| 类别 | 变化 |
|---|---|
| **框架** | Astro 6.3→7.0, Svelte→5.56, @astrojs/svelte 8→9, @astrojs/mdx 5→7 |
| **字体** | FontManager (手动 @font-face) → FontSetup (Astro Font API)。旧版用本地 woff2 (Noto Serif SC)，新版需手动迁移到 Astro Font API |
| **Live2D** | 自定义 SDK → l2d-widget npm 包 |
| **Bangumi 组件** | 4个 Astro 组件 → 4个 Svelte 5 组件 (响应式 runes) |
| **ClientPagination** | Astro DOM 操作 → Svelte 5 回调驱动 |
| **构建管线** | icons→build→pagefind → **icons→lqips→build→subset-fonts→pagefind** |
| **新页面** | 无 → 动漫追番页 (Bilibili+TMDB)、分类页、标签云页 |
| **LQIP** | 无 → 构建时梯度占位图生成 |
| **背景视频** | 无 → BackgroundPlayer 组件 |
| **Banner 轮播** | JS 驱动 → CSS 驱动 (fade/kenburns/slide) + 键盘+触控 |
| **相关文章** | 被注释掉 → 已启用 |
| **SiteInfo widget** | 无 → 新增构建元数据侧栏部件 |
| **ArchivePanel** | 无折叠 → 支持年份折叠 + 分类标签 |
| **MusicPlayer** | 全量渲染 → 虚拟滚动 + 动画均衡器 + 竞态修复 |

### Bug 修复（新版已解决）
- Mermaid/PlantUML 阻止页面滚轮
- 触摸设备误触发拖拽
- 壁纸初始化异常（不可切换模式）
- 移动端 banner 定位偏移
- OG 图片 sharp 动态导入
- 音乐播放器快速切歌竞态

### 配置结构变化
| 旧路径 | 新路径 |
|---|---|
| `siteConfig.analytics.*` | `analyticsConfig.*` (独立文件) |
| `siteConfig.rehypeCallouts` | `siteConfig.post.rehypeCallouts` |
| `siteConfig.showLastModified` | `siteConfig.post.showLastModified` |
| `siteConfig.outdatedThreshold` | `siteConfig.post.outdatedThreshold` |
| `siteConfig.sharePoster` | `siteConfig.post.sharePoster` |
| `siteConfig.generateOgImages` | `siteConfig.post.generateOgImages` |
| `backgroundWallpaper.banner.carousel` | `backgroundWallpaper.common.carousel` |
| `live2dModelConfig` | `live2dWidgetConfig` |
| `relpays` (拼写错误) | `replays` |
| `adConfig.ts` (独立) | 广告 inline 到 sidebarConfig |

### 用户已做的决策

1. **导航**：保留新版丰富的导航结构（含子菜单），旧版外部链接值填入对应位置
2. **字体**：手动配置新版 Astro Font API，使用 Noto Serif SC (思源宋体) 为 body 字体。旧版 woff2 文件复制到 `public/assets/fonts/`，在 `fontsList` 中注册 local provider
3. **广告**：不保留旧广告
4. **Cloudflare 部署**：
   - `wrangler.jsonc` 中 name 改为 `"raynardsblog"`，compatibility_date 更新为当前日期
   - CF Workers SSR 模式需设置 `CF_WORKERS=1` 环境变量触发 @astrojs/cloudflare 适配器

### 待执行的迁移工作

1. **文章**：复制旧版 29 篇 .md → 新版，删除 13 篇 demo 文章 + 15 张 demo 图片
2. **配置**：逐文件将旧值迁移到新版（详见计划文件 `C:\Users\22317\.claude\plans\v-blog-raynardsblog-enchanted-seahorse.md`）
3. **字体**：复制 woff2 文件 + 注册到 fontsList + 设置 selected
4. **wrangler.jsonc**：更新 name 和 compatibility_date
5. **验证**：确认文件完整性 + 配置无语法错误

