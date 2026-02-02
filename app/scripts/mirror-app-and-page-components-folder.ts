import fs from "node:fs";
import path from "node:path";

/**
 * Recursively creates a mirrored directory tree without files, and creates a
 * folder for every .tsx file found in the source.
 *
 * @param source The original directory (e.g., 'src/app')
 * @param destination The target directory (e.g., 'src/components-shared')
 */
function mirrorStructure(source: string, destination: string) {
  // Ensure the destination root exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source, {
    withFileTypes: true,
  });

  for (const item of items) {
    // Handle Directories by mirroring the folder and recursing
    if (item.isDirectory()) {
      const destPath = path.join(destination, item.name);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      const sourcePath = path.join(source, item.name);
      mirrorStructure(sourcePath, destPath);
    }

    // Handle .tsx files by creating a folder for that file in destination
    else if (item.isFile() && item.name.endsWith(".tsx")) {
      const fileNameWithoutExt = path.parse(item.name).name;
      const destFolderPath = path.join(destination, fileNameWithoutExt);

      if (!fs.existsSync(destFolderPath)) {
        fs.mkdirSync(destFolderPath, { recursive: true });
        console.log(`Created folder for file: ${destFolderPath}`);
      }
    }
  }
}

// Execution
const SRC_APP = path.resolve(process.cwd(), "src/app");
const SRC_PAGE_COMPONENTS = path.resolve(process.cwd(), "src/components-page");

try {
  console.log("Mirroring folder structure...");
  mirrorStructure(SRC_APP, SRC_PAGE_COMPONENTS);
  console.log("Mirroring complete!");
} catch (error) {
  console.error("Failed to mirror structure:", error);
  process.exit(1);
}
