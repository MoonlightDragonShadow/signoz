import { I18nextProvider } from 'react-i18next';
import { fireEvent, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';

import chineseConsole from '../../../public/locales/zh-CN/console.json';
import LanguageSelector from './LanguageSelector';

it('switches the interface to Chinese and falls back to English for untranslated copy', async () => {
	const i18n = createInstance();
	await i18n.init({
		lng: 'en',
		fallbackLng: 'en',
		resources: {
			en: { translation: { untranslated: 'Untranslated copy' } },
			'zh-CN': { console: chineseConsole },
		},
	});

	render(
		<I18nextProvider i18n={i18n}>
			<LanguageSelector />
		</I18nextProvider>,
	);

	fireEvent.keyDown(screen.getByRole('combobox', { name: 'Language' }), {
		key: 'ArrowDown',
		keyCode: 40,
	});
	fireEvent.click(await screen.findByRole('option', { name: '简体中文' }));

	expect(
		await screen.findByRole('combobox', { name: '界面语言' }),
	).toBeInTheDocument();
	expect(i18n.language).toBe('zh-CN');
	expect(i18n.t('untranslated')).toBe('Untranslated copy');

	fireEvent.keyDown(screen.getByRole('combobox', { name: '界面语言' }), {
		key: 'ArrowDown',
		keyCode: 40,
	});
	fireEvent.click(await screen.findByRole('option', { name: 'English' }));

	expect(
		await screen.findByRole('combobox', { name: 'Language' }),
	).toBeInTheDocument();
	expect(i18n.language).toBe('en');
});
