import fs from "fs";
import path from "path";

import {NextConfig} from "next";

let hasLoggedGenerationAttemptInThisProcess = false;

/**
 * Parsea un archivo CSS y extrae los tokens de variables CSS
 */
function parseCSSTokens(filePath: string): Record<string, string[]> {
  try {
    const cssContent = fs.readFileSync(filePath, "utf-8");
    const tokens: Record<string, string[]> = {};

    // Regex para capturar variables CSS dentro de @theme
    const themeBlockRegex = /@theme\s*\{([^}]+)\}/g;
    const variableRegex = /--([a-zA-Z0-9-]+):\s*[^;]+;/g;

    const themeMatch = themeBlockRegex.exec(cssContent);

    if (!themeMatch) {
      console.warn("No se encontró bloque @theme en el archivo CSS");

      return tokens;
    }

    const themeContent = themeMatch[1];
    let match;

    while ((match = variableRegex.exec(themeContent)) !== null) {
      const fullVariableName = match[1];

      const parts = fullVariableName.split("-");

      if (parts.length < 2) continue;

      const prefix = parts[0];
      const tokenName = parts.slice(1).join("-");

      if (!tokens[prefix]) {
        tokens[prefix] = [];
      }

      if (!tokens[prefix].includes(tokenName)) {
        tokens[prefix].push(tokenName);
      }
    }

    return tokens;
  } catch (error) {
    console.error("Error leyendo el archivo CSS:", error);

    return {};
  }
}

/**
 * Genera el archivo de configuración JSON automáticamente
 */
function generateConfigFile(): void {
  const cssFilePath = "./src/shared/styles/semantic-tokens/font.css";
  const outputPath = "./src/shared/utils/tw-merge/helpers/generated-config.json";

  const isFirstLoggingAttemptInThisProcess = !hasLoggedGenerationAttemptInThisProcess;

  if (isFirstLoggingAttemptInThisProcess) {
    console.log("🔍 Generando configuración TailwindMerge desde:", cssFilePath);
  }

  const tokens = parseCSSTokens(cssFilePath);

  // Generar el contenido del archivo TypeScript
  const configContent = JSON.stringify(tokens, null, 6);

  // Crear directorio si no existe
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  // Escribir el archivo solo si hay cambios
  let shouldWrite = true;

  if (fs.existsSync(outputPath)) {
    const existingContent = fs.readFileSync(outputPath, "utf-8");

    shouldWrite = existingContent !== configContent;
  }

  if (shouldWrite) {
    fs.writeFileSync(outputPath, configContent);
    if (isFirstLoggingAttemptInThisProcess) {
      console.log("✅ Configuración TailwindMerge actualizada");
      console.log("📊 Tokens encontrados:");
      Object.entries(tokens).forEach(([prefix, tokenList]) => {
        console.log(`   ${prefix}: ${tokenList.length} tokens`);
      });
    }
  } else {
    if (isFirstLoggingAttemptInThisProcess) {
      console.log("ℹ️ Configuración TailwindMerge sin cambios");
    }
  }

  if (isFirstLoggingAttemptInThisProcess) {
    hasLoggedGenerationAttemptInThisProcess = true;
  }
}

export function withTailwindMergeConfig(config: NextConfig): NextConfig {
  generateConfigFile();

  return config;
}
