import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();
const output = join(root, "dist");
const oldDomain = "https://fisiobemestar.vercel.app";
const officialDomain = "https://www.healthfisiobemestar.com.br";
const ignoredDirectories = new Set([".git", ".vercel", "dist", "node_modules"]);
const ignoredFiles = new Set(["build.mjs", "vercel.json"]);
const textExtensions = new Set([".html", ".xml", ".txt", ".json", ".js", ".css", ".webmanifest"]);

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });

  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    if (entry.isFile() && ignoredFiles.has(entry.name) && source === root) continue;

    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (textExtensions.has(extname(entry.name).toLowerCase())) {
      const original = await readFile(sourcePath, "utf8");
      const updated = original.replaceAll(oldDomain, officialDomain);
      await writeFile(destinationPath, updated, "utf8");
      continue;
    }

    await copyFile(sourcePath, destinationPath);
  }
}

await rm(output, { recursive: true, force: true });
await copyDirectory(root, output);
console.log(`Site preparado com domínio oficial: ${officialDomain}`);
