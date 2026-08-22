import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_ESP32_IP || 'http://192.168.4.1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              let headerSize = 0;
              const headers = proxyReq.getHeaders();
              for (const key in headers) {
                headerSize += key.length + String(headers[key]).length + 4;
              }
              console.log(`[Vite Proxy] Forwarding: ${proxyReq.path} (~${headerSize} bytes)`);
              if (headerSize > 1024) {
                console.warn(`[WARNING] Header size (${headerSize} bytes) may exceed ESP32 limit!`);
              }
            });
          },
        },
      },
    },
  };
});
