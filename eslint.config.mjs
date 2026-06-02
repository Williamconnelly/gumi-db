import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mjs'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/typedef': ['error', { variableDeclaration: true }],
			'padding-line-between-statements': [
				'error',
				{ blankLine: 'always', prev: 'if', next: '*' },
				{ blankLine: 'always', prev: '*', next: 'return' },
			],
		},
	},
	{
		files: ['src/db/**'],
		rules: {
			'@typescript-eslint/typedef': [
				'error',
				{
					variableDeclaration: false,
				},
			],
		},
	},
	{
		ignores: ['dist/**', 'node_modules/**'],
	}
);
