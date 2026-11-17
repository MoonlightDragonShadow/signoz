import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useMemo } from 'react';
import { Input } from '@signozhq/ui/input';
import { Select } from 'antd';
import { Typography } from '@signozhq/ui/typography';

import { ADVANCED_OPTIONS_TIME_UNIT_OPTIONS } from '../../context/constants';
import {
	getCumulativeWindowDescription,
	getRollingWindowDescription,
	TIMEZONE_DATA,
} from '../constants';
import TimeInput from '../TimeInput';
import { IEvaluationWindowDetailsProps } from '../types';
import {
	getCumulativeWindowTimeframeText,
	getCustomRollingWindowTimeframeText,
} from '../utils';

function EvaluationWindowDetails({
	evaluationWindow,
	setEvaluationWindow,
}: IEvaluationWindowDetailsProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const currentHourOptions = useMemo(() => {
		const options = [];
		for (let i = 0; i < 60; i++) {
			options.push({ label: i.toString(), value: i });
		}
		return options;
	}, []);

	const currentMonthOptions = useMemo(() => {
		const options = [];
		for (let i = 1; i <= 31; i++) {
			options.push({ label: i.toString(), value: i });
		}
		return options;
	}, []);

	const displayText = useMemo(() => {
		if (
			evaluationWindow.windowType === 'rolling' &&
			evaluationWindow.timeframe === 'custom'
		) {
			return getCustomRollingWindowTimeframeText(
				evaluationWindow,
				translateConsole,
			);
		}
		if (evaluationWindow.windowType === 'cumulative') {
			return getCumulativeWindowTimeframeText(evaluationWindow, translateConsole);
		}
		return '';
	}, [evaluationWindow, translateConsole]);

	if (
		evaluationWindow.windowType === 'rolling' &&
		evaluationWindow.timeframe !== 'custom'
	) {
		return <div />;
	}

	const isCurrentHour =
		evaluationWindow.windowType === 'cumulative' &&
		evaluationWindow.timeframe === 'currentHour';
	const isCurrentDay =
		evaluationWindow.windowType === 'cumulative' &&
		evaluationWindow.timeframe === 'currentDay';
	const isCurrentMonth =
		evaluationWindow.windowType === 'cumulative' &&
		evaluationWindow.timeframe === 'currentMonth';

	const handleNumberChange = (value: string): void => {
		setEvaluationWindow({
			type: 'SET_STARTING_AT',
			payload: {
				number: value,
				time: evaluationWindow.startingAt.time,
				timezone: evaluationWindow.startingAt.timezone,
				unit: evaluationWindow.startingAt.unit,
			},
		});
	};

	const handleTimeChange = (value: string): void => {
		setEvaluationWindow({
			type: 'SET_STARTING_AT',
			payload: {
				number: evaluationWindow.startingAt.number,
				time: value,
				timezone: evaluationWindow.startingAt.timezone,
				unit: evaluationWindow.startingAt.unit,
			},
		});
	};

	const handleUnitChange = (value: string): void => {
		setEvaluationWindow({
			type: 'SET_STARTING_AT',
			payload: {
				number: evaluationWindow.startingAt.number,
				time: evaluationWindow.startingAt.time,
				timezone: evaluationWindow.startingAt.timezone,
				unit: value,
			},
		});
	};

	const handleTimezoneChange = (value: string): void => {
		setEvaluationWindow({
			type: 'SET_STARTING_AT',
			payload: {
				number: evaluationWindow.startingAt.number,
				time: evaluationWindow.startingAt.time,
				timezone: value,
				unit: evaluationWindow.startingAt.unit,
			},
		});
	};

	if (isCurrentHour) {
		return (
			<div className="evaluation-window-details">
				<Typography.Text>
					{getCumulativeWindowDescription(evaluationWindow.timeframe)}
				</Typography.Text>
				<Typography.Text>{displayText}</Typography.Text>
				<div className="select-group">
					<Typography.Text>{translateConsole('STARTING AT MINUTE')}</Typography.Text>
					<Select
						options={currentHourOptions}
						value={evaluationWindow.startingAt.number || null}
						onChange={handleNumberChange}
						placeholder={translateConsole('Select starting at')}
						data-testid="evaluation-window-details-starting-at-select"
					/>
				</div>
			</div>
		);
	}

	if (isCurrentDay) {
		return (
			<div className="evaluation-window-details">
				<Typography.Text>
					{getCumulativeWindowDescription(evaluationWindow.timeframe)}
				</Typography.Text>
				<Typography.Text>{displayText}</Typography.Text>
				<div className="select-group time-select-group">
					<Typography.Text>{translateConsole('STARTING AT')}</Typography.Text>
					<TimeInput
						value={evaluationWindow.startingAt.time}
						onChange={handleTimeChange}
					/>
				</div>
				<div className="select-group">
					<Typography.Text>{translateConsole('SELECT TIMEZONE')}</Typography.Text>
					<Select
						options={TIMEZONE_DATA}
						value={evaluationWindow.startingAt.timezone || null}
						onChange={handleTimezoneChange}
						placeholder={translateConsole('Select timezone')}
						data-testid="evaluation-window-details-timezone-select"
					/>
				</div>
			</div>
		);
	}

	if (isCurrentMonth) {
		return (
			<div className="evaluation-window-details">
				<Typography.Text>
					{getCumulativeWindowDescription(evaluationWindow.timeframe)}
				</Typography.Text>
				<Typography.Text>{displayText}</Typography.Text>
				<div className="select-group">
					<Typography.Text>{translateConsole('STARTING ON DAY')}</Typography.Text>
					<Select
						options={currentMonthOptions}
						value={evaluationWindow.startingAt.number || null}
						onChange={handleNumberChange}
						placeholder={translateConsole('Select starting at')}
						data-testid="evaluation-window-details-starting-at-select"
					/>
				</div>
				<div className="select-group time-select-group">
					<Typography.Text>{translateConsole('STARTING AT')}</Typography.Text>
					<TimeInput
						value={evaluationWindow.startingAt.time}
						onChange={handleTimeChange}
					/>
				</div>
				<div className="select-group">
					<Typography.Text>{translateConsole('SELECT TIMEZONE')}</Typography.Text>
					<Select
						options={TIMEZONE_DATA}
						value={evaluationWindow.startingAt.timezone || null}
						onChange={handleTimezoneChange}
						placeholder={translateConsole('Select timezone')}
						data-testid="evaluation-window-details-timezone-select"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="evaluation-window-details">
			<Typography.Text>
				{getRollingWindowDescription(evaluationWindow.timeframe)}
			</Typography.Text>
			<Typography.Text>
				{translateConsole('Specify custom duration')}
			</Typography.Text>
			<Typography.Text>{displayText}</Typography.Text>
			<div className="select-group">
				<Typography.Text>{translateConsole('VALUE')}</Typography.Text>
				<Input
					name="value"
					type="number"
					value={evaluationWindow.startingAt.number}
					onChange={(e): void => handleNumberChange(e.target.value)}
					placeholder={translateConsole('Enter value')}
					data-testid="evaluation-window-details-custom-rolling-window-duration-input"
				/>
			</div>
			<div className="select-group time-select-group">
				<Typography.Text>{translateConsole('UNIT')}</Typography.Text>
				<Select
					options={ADVANCED_OPTIONS_TIME_UNIT_OPTIONS}
					value={evaluationWindow.startingAt.unit || null}
					onChange={handleUnitChange}
					placeholder={translateConsole('Select unit')}
					data-testid="evaluation-window-details-custom-rolling-window-unit-select"
				/>
			</div>
		</div>
	);
}

export default EvaluationWindowDetails;
