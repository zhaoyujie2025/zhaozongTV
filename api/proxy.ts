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

    // 转发请求
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
        ...(req.headers as Record<string, string>),
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.text()

    // 设置响应头
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.status(response.status).send(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
