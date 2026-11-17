import { act, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import chineseConsole from '../../../../public/locales/zh-CN/console.json';
import RefreshText from './Refresh';

jest.mock('antd', () => ({
	Tooltip: ({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}): JSX.Element => (
		<div>
			{title}
			{children}
		</div>
	),
}));

jest.mock('./styles', () => ({
	RefreshTextContainer: ({
		children,
	}: {
		children: React.ReactNode;
	}): JSX.Element => <div>{children}</div>,
}));

it('translates the refresh tooltip and updates it when the language changes', async () => {
	const i18n = createInstance();
	await i18n.init({
		lng: 'zh-CN',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		resources: { en: { console: {} }, 'zh-CN': { console: chineseConsole } },
	});
	jest.useFakeTimers();
	try {
		render(
			<I18nextProvider i18n={i18n}>
				<RefreshText
					onLastRefreshHandler={(): string => 'Refreshed 5 mins ago'}
					refreshButtonHidden={false}
				/>
			</I18nextProvider>,
		);
		act(() => {
			jest.advanceTimersByTime(2000);
		});
		expect(screen.getByText('5 分钟前刷新')).toBeInTheDocument();
		await act(async () => {
			await i18n.changeLanguage('en');
		});
		expect(screen.getByText('Refreshed 5 mins ago')).toBeInTheDocument();
	} finally {
		jest.useRealTimers();
	}
});
