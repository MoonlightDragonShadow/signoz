import { act, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import chineseConsole from '../../../public/locales/zh-CN/console.json';
import LocalizedRelativeTime from './LocalizedRelativeTime';
import { localizeRelativeTime } from './localizeRelativeTime';

async function createTestI18n(): Promise<ReturnType<typeof createInstance>> {
	const i18n = createInstance();
	await i18n.init({
		lng: 'zh-CN',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		resources: { en: { console: {} }, 'zh-CN': { console: chineseConsole } },
	});
	return i18n;
}

it.each([
	['Refreshed 2 months ago', '2 个月前刷新'],
	['Refreshed 5 mins ago', '5 分钟前刷新'],
	['Last Updated 3 hrs ago', '3 小时前更新'],
	['Last Updated 30 sec ago', '30 秒前更新'],
	['5m ago', '5 分钟前'],
	['1 hr ago', '1 小时前'],
	['2 days ago', '2 天前'],
	['1 month ago', '1 个月前'],
	['Few seconds ago', '几秒前'],
	['a few seconds ago', '几秒前'],
	['a minute ago', '1 分钟前'],
	['an hour ago', '1 小时前'],
	['in 3 days', '3 天后'],
	['in a day', '1 天后'],
	['Yesterday at 12:30', '昨天 12:30'],
	['No updates yet!', '尚无更新'],
])(
	'localizes %s without changing its English representation',
	async (value, expected) => {
		const i18n = await createTestI18n();
		const translate = (key: string, values?: Record<string, unknown>): string =>
			i18n.t(key, {
				...values,
				ns: 'console',
				defaultValue: key,
				keySeparator: false,
				nsSeparator: false,
			});
		expect(localizeRelativeTime(value, translate)).toBe(expected);
		await i18n.changeLanguage('en');
		expect(localizeRelativeTime(value, translate)).toBe(value);
	},
);

it('updates immediately when switching languages and leaves unknown values intact', async () => {
	const i18n = await createTestI18n();
	const { rerender } = render(
		<I18nextProvider i18n={i18n}>
			<LocalizedRelativeTime value="5m ago" />
		</I18nextProvider>,
	);
	expect(screen.getByText('5 分钟前')).toBeInTheDocument();
	await act(async () => {
		await i18n.changeLanguage('en');
	});
	expect(screen.getByText('5m ago')).toBeInTheDocument();
	await act(async () => {
		await i18n.changeLanguage('zh-CN');
	});
	rerender(
		<I18nextProvider i18n={i18n}>
			<LocalizedRelativeTime value="custom-identifier" />
		</I18nextProvider>,
	);
	expect(screen.getByText('custom-identifier')).toBeInTheDocument();
});
