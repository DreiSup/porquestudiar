import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Configuración base para todos los archivos
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // Por defecto, tratamos todo como ESModules
      globals: {
        ...globals.node,
        ...globals.browser, // Añadimos browser si estás haciendo frontend
      },
    },
  },

  // 2. Regla específica para archivos CommonJS (.cjs)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },

  // 3. Si tienes archivos .js que REALMENTE son CommonJS (como tailwind.config.js)
  // puedes añadirlos aquí específicamente o renombrarlos a .cjs
  {
    files: ["tailwind.config.js", "postcss.config.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
];