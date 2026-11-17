import { I18nextProvider } from 'react-i18next';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { mockAppLocation } from 'tests/router-mocks';

import chineseConsole from '../../../public/locales/zh-CN/console.json';
import CustomTimePicker from './CustomTimePicker';

jest.mock('hooks/useZoomOut', () => ({
	useZoomOut: (): jest.Mock => jest.fn(),
}));

jest.mock('providers/Timezone', () => ({
	useTimezone: (): { timezone: { value: string; offset: string } } => ({
		timezone: { value: 'UTC', offset: 'UTC' },
	}),
}));

async function createTestI18n(): Promise<ReturnType<typeof createInstance>> {
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
	return i18n;
}

const defaultProps = {
	onSelect: jest.fn(),
	onError: jest.fn(),
	onValidCustomDateChange: jest.fn(),
	selectedTime: '30m',
	selectedValue: '30m',
	open: false,
	setOpen: jest.fn(),
	items: [{ label: 'Last 2 weeks', value: '2w' }],
	minTime: 1705311000000 * 1e6,
	maxTime: 1705312800000 * 1e6,
	'data-testid': 'time-range-input',
};

beforeEach(() => {
	jest.clearAllMocks();
	mockAppLocation({ pathname: '/logs-explorer' });
});

it.each([
	['1h', '最近 1 小时', 'Last 1 hour'],
	['2w', '最近 2 周', 'Last 2 weeks'],
	['13m', '最近 13 分钟', 'Last 13 minutes'],
	['2months', '最近 2 个月', 'Last 2 months'],
])(
	'localizes selected range %s and updates when the language changes',
	async (value, chinese, english) => {
		const i18n = await createTestI18n();
		const { rerender } = render(
			<I18nextProvider i18n={i18n}>
				<CustomTimePicker {...defaultProps} />
			</I18nextProvider>,
		);

		rerender(
			<I18nextProvider i18n={i18n}>
				<CustomTimePicker
					{...defaultProps}
					selectedTime={value}
					selectedValue={value}
				/>
			</I18nextProvider>,
		);
		expect(screen.getByTestId('time-range-input')).toHaveValue(chinese);

		await act(async () => {
			await i18n.changeLanguage('en');
		});
		expect(screen.getByTestId('time-range-input')).toHaveValue(english);

		await act(async () => {
			await i18n.changeLanguage('zh-CN');
		});
		expect(screen.getByTestId('time-range-input')).toHaveValue(chinese);
	},
);

it('updates the live label when the language changes', async () => {
	const i18n = await createTestI18n();
	render(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker {...defaultProps} showLiveLogs />
		</I18nextProvider>,
	);
	expect(screen.getByTestId('time-range-input')).toHaveValue('实时');
	await act(async () => {
		await i18n.changeLanguage('en');
	});
	expect(screen.getByTestId('time-range-input')).toHaveValue('Live');
});

it('preserves a manually entered duration when the language changes', async () => {
	const i18n = await createTestI18n();
	render(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker {...defaultProps} open />
		</I18nextProvider>,
	);

	const input = screen.getByTestId('time-range-input');
	fireEvent.change(input, { target: { value: '13m' } });
	await act(async () => {
		await i18n.changeLanguage('en');
	});
	expect(input).toHaveValue('13m');

	fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
	expect(defaultProps.onValidCustomDateChange).toHaveBeenCalledWith(
		expect.objectContaining({ timeStr: '13m' }),
	);
});

it('keeps a custom date range unchanged when switching languages', async () => {
	const i18n = await createTestI18n();
	const value = '2024-01-01 00:00:00 - 2024-01-01 01:00:00';
	const { rerender } = render(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker {...defaultProps} />
		</I18nextProvider>,
	);
	rerender(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker
				{...defaultProps}
				selectedTime="custom"
				selectedValue={value}
			/>
		</I18nextProvider>,
	);
	expect(screen.getByTestId('time-range-input')).toHaveValue(value);
	await act(async () => {
		await i18n.changeLanguage('en');
	});
	expect(screen.getByTestId('time-range-input')).toHaveValue(value);
});

it('selects a translated relative suggestion using its original value', async () => {
	const i18n = await createTestI18n();
	render(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker {...defaultProps} newPopover open />
		</I18nextProvider>,
	);
	const option = await screen.findByTestId('time-chip-2w');
	expect(option).toHaveTextContent('最近 2 周');
	fireEvent.click(option);
	expect(defaultProps.onSelect).toHaveBeenCalledWith('2w');
});

it('localizes the legacy option without changing its selection value', async () => {
	const i18n = await createTestI18n();
	render(
		<I18nextProvider i18n={i18n}>
			<CustomTimePicker {...defaultProps} open />
		</I18nextProvider>,
	);
	fireEvent.click(await screen.findByText('最近 2 周'));
	expect(defaultProps.onSelect).toHaveBeenCalledWith('2w');
});
