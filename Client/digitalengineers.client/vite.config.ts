import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    base: "",
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://localhost:7001',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
