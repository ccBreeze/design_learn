import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier
    },
    rules: {
      // 禁用分号
      'semi': ['error', 'never'],
      '@typescript-eslint/semi': ['error', 'never'],
      
      // TypeScript 推荐规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
          'args': 'after-used',
          'destructuredArrayIgnorePattern': '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // 允许构造函数参数未使用（用于依赖注入等模式）
      'no-unused-vars': 'off', // 关闭基础规则，使用 TypeScript 版本
      
      // Prettier 集成
      'prettier/prettier': 'error'
    }
  },
  {
    // TypeScript 文件的特殊配置
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    }
  },
  {
    // 测试文件配置
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        console: 'readonly'
      }
    }
  },
  // Prettier 配置（禁用与 Prettier 冲突的规则）
  prettierConfig,
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts']
  }
]