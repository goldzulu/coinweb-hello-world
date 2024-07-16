import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const packageJsonPath = join(ROOT, 'dist', 'out', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const { name } = packageJson;

const yamlFilePath = join(ROOT, 'deploy', 'calls.yaml.template');
const yamlContent = readFileSync(yamlFilePath, 'utf8');
const modifiedYamlContent = yamlContent.replace(/__CWEB_CONTRACT_SELF_REFERENCE__/g, name.substring(5));
const callObject = yaml.load(modifiedYamlContent);

const outputPath = join(ROOT, 'deploy', 'calls.yaml');
writeFileSync(outputPath, yaml.dump({ calls: [callObject] }));

console.log('Prepare successfully completed');
