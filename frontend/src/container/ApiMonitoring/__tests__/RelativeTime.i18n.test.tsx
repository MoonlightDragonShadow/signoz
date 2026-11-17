import { render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import chineseConsole from '../../../../public/locales/zh-CN/console.json';
import { getEndPointsColumnsConfig } from '../utils';

it.each([
	['an already formatted time', '5m ago'],
	['a timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()],
])('localizes %s in grouped endpoint rows', async (_description, lastUsed) => {
	const i18n = createInstance();
	await i18n.init({
		lng: 'zh-CN',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		resources: { en: { console: {} }, 'zh-CN': { console: chineseConsole } },
	});
	const column = getEndPointsColumnsConfig(true, []).find(
		(item) => item.key === 'lastUsed',
	);
	const cell = column?.render?.(lastUsed, {} as never, 0);
	render(
		<I18nextProvider i18n={i18n}>{cell as React.ReactNode}</I18nextProvider>,
	);
	expect(screen.getByText('5 分钟前')).toBeInTheDocument();
});
