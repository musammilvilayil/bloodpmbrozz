import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom dev middleware plugin to serve /api routes locally identically to Vercel serverless
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];

        if (url === '/api/donors') {
          try {
            const { default: handler } = await import('./api/donors.js');
            res.status = (code) => { res.statusCode = code; return res; };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            return await handler(req, res);
          } catch (e) {
            console.error('API /api/donors dev error:', e);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: e.message }));
          }
        }

        if (url === '/api/admin') {
          try {
            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const str = Buffer.concat(buffers).toString();
              if (str) {
                try { body = JSON.parse(str); } catch (err) {}
              }
            }
            req.body = body;
            const { default: handler } = await import('./api/admin.js');
            res.status = (code) => { res.statusCode = code; return res; };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            return await handler(req, res);
          } catch (e) {
            console.error('API /api/admin dev error:', e);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: e.message }));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiDevMiddleware(),
  ],
})
