// 引入 ESLint 官方 JS 推荐规则。
import js from "@eslint/js";
// 引入全局变量预设。
import globals from "globals";
// 引入 React Hooks 规则插件。
import reactHooks from "eslint-plugin-react-hooks";
// 引入 React Refresh 规则插件。
import reactRefresh from "eslint-plugin-react-refresh";
// 引入 TypeScript ESLint 配置工具。
import tseslint from "typescript-eslint";
// 引入全局忽略配置工具。
import { globalIgnores } from "eslint/config";

// 导出 ESLint 扁平配置。
export default tseslint.config([
  // 忽略构建产物目录。
  globalIgnores(["dist"]),
  // 配置 TypeScript 与 TSX 文件规则。
  {
    // 仅匹配 TypeScript 源码文件。
    files: ["**/*.{ts,tsx}"],
    // 继承推荐规则集合。
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    // 配置语言选项。
    languageOptions: {
      // 指定 ECMAScript 语法版本。
      ecmaVersion: 2020,
      // 启用浏览器全局变量。
      globals: globals.browser,
    },
  },
]);
