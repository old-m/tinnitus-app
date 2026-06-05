const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)

    // ✅ Proxy tinnitus app
    if (req.url.startsWith('/toys/tinnitus-app')) {
      const https = require('https')

      const targetPath = req.url.replace('/toys/tinnitus-app', '') || '/'
      const options = {
        hostname: 'app-hornbyjw-tinnitus-prod-buh0e7a6gahrgve9.ukwest-01.azurewebsites.net',
        path: targetPath,
        method: req.method,
        headers: {
          ...req.headers,
          host: 'app-hornbyjw-tinnitus-prod-buh0e7a6gahrgve9.ukwest-01.azurewebsites.net'
        }
      }

      const proxyReq = https.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      })

      req.pipe(proxyReq, { end: true })

      proxyReq.on('error', err => {
        console.error('Proxy error:', err)
        res.writeHead(500)
        res.end('Proxy error')
      })

      return
    }

    // ✅ Normal Next.js handling
    handle(req, res, parsedUrl)

  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})