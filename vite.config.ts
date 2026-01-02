import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// 插件：构建时从 package.json 生成 version 文件
function generateVersionFile() {
  return {
    name: 'generate-version-file',
    writeBundle() {
      const __dirname = fileURLToPath(new URL('.', import.meta.url));
      const packageJsonPath = resolve(__dirname, 'package.json');
      const outDir = resolve(__dirname, 'dist');

      // 读取 package.json
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const version = packageJson.version;

      // 确保 dist 目录存在
      mkdirSync(outDir, { recursive: true });

      // 写入 version 文件
      writeFileSync(resolve(outDir, 'version'), version, 'utf-8');
      console.log(`\x1b[32m✓\x1b[0m Generated version file: ${version}`);
    }
  };
}

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1600
  },
  preview: {
    open: true,
    host: true
  },
  define: {
    global: 'window'
  },
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
    }
  },
  plugins: [react(), viteTsconfigPaths(), generateVersionFile()]
});