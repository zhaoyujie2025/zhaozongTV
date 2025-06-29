import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' })
    }

    // 解码 URL
    const targetUrl = decodeURIComponent(url)

    // 验证 URL 格式
    try {
      new URL(targetUrl)
    } catch {
      return res.status(400).json({ error: 'Invalid URL' })
    }

    // 转发请求 - 只发送必要的请求头，避免头部过大导致 400 错误
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        // 不发送 Accept-Encoding，避免压缩响应导致的问题
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    })

    // 获取响应内容
    const text = await response.text()

    // 设置响应头
    const contentType = response.headers.get('content-type') || 'application/json'
    res.setHeader('Content-Type', contentType)

    // 返回响应
    res.status(response.status).send(text)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
