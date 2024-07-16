import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function makeCall() {
  const packageJsonPath = join(ROOT, "dist", "out", "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const { name } = packageJson;

  const yamlFilePath = join(ROOT, "deploy", "calls.yaml.template");
  const yamlContent = readFileSync(yamlFilePath, "utf8");
  const modifiedYamlContent = yamlContent.replace(/__CWEB_CONTRACT_SELF_REFERENCE__/g, name.substring(5));

  const outputPath = join(ROOT, "deploy", ".calls-package.yaml");
  writeFileSync(outputPath, modifiedYamlContent);
}

try {
  makeCall();
} catch (error) {
  console.error("Failed to create calls package:", error);
  process.exit(1);
}
