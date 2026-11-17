import { I18nextProvider } from 'react-i18next';
import { act, renderHook } from '@testing-library/react';
import { createInstance } from 'i18next';

import chineseConsole from '../../public/locales/zh-CN/console.json';
import useConsoleTranslation from './useConsoleTranslation';

it('interpolates names and counts in both languages and updates after switching', async () => {
	const i18n = createInstance();
	await i18n.init({
		lng: 'zh-CN',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		resources: {
			en: { console: {} },
			'zh-CN': { console: chineseConsole },
		},
	});

	const { result } = renderHook(() => useConsoleTranslation(), {
		wrapper: ({ children }) => (
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		),
	});

	expect(result.current('Copy {{value1}}', { value1: 'service.name' })).toBe(
		'复制 service.name',
	);
	expect(result.current('All members ⎯ {{value1}}', { value1: 3 })).toBe(
		'全部成员 ⎯ 3',
	);

	await act(async () => {
		await i18n.changeLanguage('en');
	});

	expect(result.current('Copy {{value1}}', { value1: 'service.name' })).toBe(
		'Copy service.name',
	);
});
