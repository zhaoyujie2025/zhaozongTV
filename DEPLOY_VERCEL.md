# Vercel 部署指南

本指南将帮助您将 OuonnkiTV 项目部署到 Vercel。

## 前置准备

1. 确保您有一个 [Vercel 账号](https://vercel.com)
2. 安装 Vercel CLI（可选）：`npm i -g vercel`

## 部署步骤

### 方法一：通过 Vercel 网页界面部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [Vercel Dashboard](https://vercel.com/new)
3. 点击 "Import Project"
4. 选择您的代码仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `pnpm build` 或 `npm run build`
   - **Output Directory**: dist
6. 添加环境变量：
   - 变量名：`VITE_PROXY_URL`
   - 值：`/api/proxy?url=`
7. 点击 "Deploy"

### 方法二：使用 Vercel CLI

```bash
# 安装依赖
pnpm install

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

## 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| VITE_PROXY_URL | /api/proxy?url= | 使用 Vercel API 路由作为代理 |

## 项目结构说明

- `/api/proxy.ts` - Vercel API 路由，用于处理 CORS 代理请求
- `vercel.json` - Vercel 配置文件，处理 SPA 路由重写
- `src/config/api.config.ts` - API 配置，支持环境变量

## 部署后验证

1. 访问您的 Vercel 域名
2. 测试搜索功能是否正常
3. 测试视频播放是否正常
4. 检查路由切换是否正常（刷新页面应该正常显示）

## 常见问题

### 1. API 请求失败
- 确保环境变量 `VITE_PROXY_URL` 设置正确
- 检查 API 路由 `/api/proxy` 是否正常工作

### 2. 路由刷新 404
- 确保 `vercel.json` 文件存在并配置正确
- 检查 rewrites 规则是否生效

### 3. 构建失败
- 确保使用正确的 Node.js 版本（>=20.0.0）
- 检查是否所有依赖都已正确安装

## 性能优化建议

1. 启用 Vercel 的缓存功能
2. 使用 Vercel Analytics 监控性能
3. 考虑使用 Vercel Edge Functions 进一步优化 API 响应速度

## 自定义域名

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Domains"
3. 添加您的自定义域名
4. 按照提示配置 DNS

## 更新部署

代码推送到主分支后，Vercel 会自动触发重新部署。您也可以手动触发：

```bash
vercel --prod
```

或在 Vercel Dashboard 中点击 "Redeploy"。

## 注意事项

- 免费版 Vercel 有一定的使用限制，请查看 [Vercel Limits](https://vercel.com/docs/limits)
- API 路由有执行时间限制（免费版 10 秒）
- 建议设置适当的缓存策略以减少 API 调用 