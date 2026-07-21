import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { shiprocketDevMiddleware } from './vite-plugins/shiprocket-dev'

function emailDevMiddleware(): Plugin {
  return {
    name: 'email-dev-middleware',
    configureServer(server) {
      // Load env vars from .env.local manually since non-VITE_ prefixed vars aren't auto-loaded
      const env = loadEnv('development', process.cwd(), '');
      const resendApiKey = env.RESEND_API_KEY;

      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        if (!resendApiKey) {
          console.error('[email-middleware] RESEND_API_KEY not found');
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing RESEND_API_KEY env var' }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => { chunks.push(chunk); });
        req.on('end', async () => {
          try {
            const body = Buffer.concat(chunks).toString();
            const { from, to, subject, html } = JSON.parse(body);
            console.log('[email-middleware] Sending email to:', to);
            const resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ from, to, subject, html }),
            });
            const data = await resendRes.json() as { id?: string; message?: string; error?: { message?: string } };
            if (!resendRes.ok) {
              console.error('[email-middleware] Resend error:', JSON.stringify(data));
            } else {
              console.log('[email-middleware] Email sent:', data.id);
            }
            res.statusCode = resendRes.ok ? 200 : resendRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (err: any) {
            console.error('[email-middleware] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emailDevMiddleware(), shiprocketDevMiddleware()],
  server: {
    proxy: {
      '/api/create-razorpay-order': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/functions/v1')
      }
    }
  }
})
