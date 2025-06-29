# Vercel 代理设置指南

本项目使用 Vercel 的 API Routes 功能来实现 CORS 代理，解决浏览器跨域限制问题。

## 工作原理

```
前端应用 → /api/proxy?url=目标API → Vercel API Route → 目标 API 服务器
         ←      返回数据        ←     处理响应      ←
```

## 配置步骤

### 1. 本地开发

创建 `.env.local` 文件：

```bash
# 本地开发时使用第三方代理
VITE_PROXY_URL=https://cors.zme.ink/
```

### 2. Vercel 部署

在 Vercel Dashboard 中设置环境变量：

- **变量名**: `VITE_PROXY_URL`
- **值**: `/api/proxy?url=`

### 3. 验证配置

部署后访问以下地址测试代理是否正常：

```
https://你的域名.vercel.app/api/proxy?url=https://json.heimuer.xyz/api.php/provide/vod/?ac=videolist&wd=test
```

应该返回 JSON 格式的搜索结果。

## 代理优势

1. **更稳定**：使用自己的服务器，不依赖第三方
2. **更安全**：请求经过自己的服务器处理
3. **更快速**：利用 Vercel 的全球边缘网络
4. **免费额度**：Vercel 提供每月 100GB 的免费流量

## 注意事项

- Vercel API Routes 有 10 秒的执行时间限制（免费版）
- 每月有请求次数和流量限制，具体查看 [Vercel Limits](https://vercel.com/docs/limits)
- 建议在生产环境监控 API 使用情况

## 故障排查

如果代理不工作：

1. 检查环境变量是否正确设置
2. 查看 Vercel Functions 日志
3. 确认 `/api/proxy.ts` 文件存在
4. 测试直接访问代理端点

## 备选方案

如果不想使用 Vercel 代理，可以：

1. 使用第三方 CORS 代理服务
2. 自建 CORS 代理服务器
3. 联系 API 提供方开启 CORS 