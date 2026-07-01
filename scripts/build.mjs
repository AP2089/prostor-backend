import { copyFileSync, mkdirSync, rmSync } from 'node:fs';

rmSync('.output', { recursive: true, force: true });
mkdirSync('.output');

copyFileSync('app/db.json', '.output/db.json');
copyFileSync('app/server.ts', '.output/server.ts');
copyFileSync('app/types.d.ts', '.output/types.d.ts');
copyFileSync('package.json', '.output/package.json');
copyFileSync('package-lock.json', '.output/package-lock.json');

/// dssd
