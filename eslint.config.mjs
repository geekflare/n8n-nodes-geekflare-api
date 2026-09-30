import tseslint from "typescript-eslint";
import { n8nCommunityNodesPlugin } from "@n8n/eslint-plugin-community-nodes";

export default [
  { ignores: ["dist/**", "node_modules/**", "scripts/**"] },
  {
    files: ["nodes/**/*.ts", "credentials/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  n8nCommunityNodesPlugin.configs.recommended,
];
