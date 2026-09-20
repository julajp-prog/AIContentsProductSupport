import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/proxy/lmstudio': {
            target: 'http://127.0.0.1:1234/v1',
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/api\/proxy\/lmstudio/, ''),
            configure: (proxy) => {
              proxy.on('error', (err, _req, res: any) => {
                if (res && !res.headersSent && typeof res.writeHead === 'function') {
                  res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
                  res.end(JSON.stringify({
                    error: {
                      message: `LM Studio (http://127.0.0.1:1234) に接続できませんでした。LM StudioでLocal Serverを起動し、モデルをロードしてください。(${err.message})`,
                      type: 'connection_error',
                      code: 'ECONNREFUSED',
                    },
                  }));
                }
              });
            },
          },
          '/api/proxy/ollama': {
            target: 'http://127.0.0.1:11434',
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/api\/proxy\/ollama/, ''),
            configure: (proxy) => {
              proxy.on('error', (err, _req, res: any) => {
                if (res && !res.headersSent && typeof res.writeHead === 'function') {
                  res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
                  res.end(JSON.stringify({
                    error: {
                      message: `Ollama (http://127.0.0.1:11434) に接続できませんでした。Ollamaが起動しているか確認してください。(${err.message})`,
                      type: 'connection_error',
                      code: 'ECONNREFUSED',
                    },
                  }));
                }
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
