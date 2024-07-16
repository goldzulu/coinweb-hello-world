import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function makeCall() {
  const packageJsonPath = join(ROOT, 'dist', 'out', 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const { name } = packageJson;

  const yamlFilePath = join(ROOT, 'deploy', 'calls.yaml.template');
  const yamlContent = await fs.readFile(yamlFilePath, 'utf8');
  const modifiedYamlContent = yamlContent.replace(/__CWEB_CONTRACT_SELF_REFERENCE__/g, name.substring(5));

  const outputPath = join(ROOT, 'deploy', '.calls-package.yaml');
  await fs.writeFile(outputPath, modifiedYamlContent);
}

makeCall().catch((error) => {
  console.error('Failed to create calls package:', error);
  process.exit(1);
});
