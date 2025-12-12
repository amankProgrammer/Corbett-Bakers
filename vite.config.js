import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Dev server middleware to redirect /api/admin to the hash-based Admin page
const adminRedirectPlugin = {
  name: 'admin-redirect',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api/admin')) {
        res.statusCode = 302
        res.setHeader('Location', '/#/admin')
        res.end()
        return
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), adminRedirectPlugin],
})
