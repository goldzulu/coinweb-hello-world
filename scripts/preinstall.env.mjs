import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFilePath = path.join(__dirname, '..', '.env.yarn.devnet');
const DEFAULT_API_ENDPOINT = 'https://api-devnet.coinweb.io/wallet';
const API_ENDPOINT = process.env.API_ENDPOINT_DEVNET || '';

let content;

if (API_ENDPOINT) {
  content = [`#API_ENDPOINT_DEVNET=${DEFAULT_API_ENDPOINT}`, `API_ENDPOINT_DEVNET=${API_ENDPOINT}`].join('\n');
} else {
  content = [`#API_ENDPOINT_DEVNET=${API_ENDPOINT}`, `API_ENDPOINT_DEVNET=${DEFAULT_API_ENDPOINT}`].join('\n');
}

fs.writeFileSync(envFilePath, content);
