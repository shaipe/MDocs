import { defineConfig } from 'taze';

export default defineConfig({
    force: true,
    write: true,
    install: true,
    mode: 'major',
    recursive: true,
    // ignore paths for looking for package.json in monorepo
    ignorePaths: ['**/node_modules/**'],
});
