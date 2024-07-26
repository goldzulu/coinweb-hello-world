import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, mkdirSync, copyFileSync, cpSync, writeFileSync, readFileSync } from 'node:fs';
import { platform } from 'node:os';

const yarnCommand = platform() === 'win32' ? 'yarn.cmd' : 'yarn';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const paths = {
  cweb_dist_onchain: join(ROOT, 'cweb_dist', 'onchain'),
  cweb_dist_offchain: join(ROOT, 'cweb_dist', 'offchain'),
  dist_tmp_step1: join(ROOT, 'dist', 'tmp', 'step1'),
  dist_tmp_step2: join(ROOT, 'dist', 'tmp', 'step2'),
  dist_tmp_step3: join(ROOT, 'dist', 'tmp', 'step3'),
  dist_tmp_final: join(ROOT, 'dist', 'tmp', 'final'),
  dist_offchain: join(ROOT, 'dist', 'offchain'),
  dist_onchain: join(ROOT, 'dist', 'onchain'),
};

// Remove and recreate directories
for (const path of Object.values(paths)) {
  if (![paths.dist_offchain, paths.dist_onchain].includes(path)) {
    rmSync(path, { recursive: true, force: true });
    mkdirSync(path, { recursive: true });
  }
}

// Copy offchain distribution
cpSync(join(paths.dist_offchain, '.'), paths.cweb_dist_offchain, { recursive: true });

// Create onchain.js with the required content
const onchainJsContent = `import {cwebMain as f} from "${resolve(paths.dist_onchain, 'index.js')}"; f();\n`;
const onchainJsPath = join(paths.dist_tmp_step1, 'onchain.js');
writeFileSync(onchainJsPath, onchainJsContent);

execSync(`${yarnCommand} esbuild \
  --bundle \
  --log-level=error \
  --format=esm \
  ${onchainJsPath} \
  --outfile=${join(paths.dist_tmp_step2, 'onchain.js')}`);

// Create a new onchain.js file with 'import * as std from "std";' prepended
const onchainJsBundlePath = join(paths.dist_tmp_step2, 'onchain.js');
const onchainJsStdPath = join(paths.dist_tmp_step3, 'onchain.js');
const stdImportContent = 'import * as std from "std";\n';
const onchainJsBundleContent = readFileSync(onchainJsBundlePath, 'utf8');
writeFileSync(onchainJsStdPath, stdImportContent + onchainJsBundleContent);

// Third iteration bundles, minifies and tree-shakes onchain.js
execSync(`${yarnCommand} esbuild \
  --bundle \
  --log-level=error \
  --minify \
  --format=esm \
  --external:std \
  --tree-shaking=true \
  ${join(paths.dist_tmp_step3, 'onchain.js')} \
  --outfile=${join(paths.dist_tmp_final, 'onchain.js')}`);

// Copy final onchain.js to cweb_dist
copyFileSync(join(paths.dist_tmp_final, 'onchain.js'), join(paths.cweb_dist_onchain, 'index.js'));

// Clean up temporary and distribution directories
rmSync(join(ROOT, 'dist', 'tmp'), { recursive: true, force: true });
rmSync(join(ROOT, 'dist', 'onchain'), { recursive: true, force: true });
rmSync(join(ROOT, 'dist', 'offchain'), { recursive: true, force: true });
