import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { SelectSimple } from '@signozhq/ui/select';
import { Switch } from '@signozhq/ui/switch';
import { Typography } from '@signozhq/ui/typography';
import { RelativeDurationOptions } from 'container/TopNav/DateTimeSelectionV2/constants';

import styles from './PublicDashboardSettingsForm.module.scss';

interface PublicDashboardSettingsFormProps {
	timeRangeEnabled: boolean;
	defaultTimeRange: string;
	disabled: boolean;
	disabledTooltip: string | undefined;
	onTimeRangeEnabledChange: (value: boolean) => void;
	onDefaultTimeRangeChange: (value: string) => void;
}

function PublicDashboardSettingsForm({
	timeRangeEnabled,
	defaultTimeRange,
	disabled,
	disabledTooltip,
	onTimeRangeEnabledChange,
	onDefaultTimeRangeChange,
}: PublicDashboardSettingsFormProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<>
			<div className={styles.switchRow}>
				<Switch
					color="primary"
					textPlacement="right"
					disabledTooltip={disabledTooltip}
					testId="public-dashboard-time-range-toggle"
					value={timeRangeEnabled}
					disabled={disabled}
					onChange={onTimeRangeEnabledChange}
				>
					{translate('Enable time range')}
				</Switch>
			</div>

			<div className={styles.fieldGroup}>
				<Typography.Text className={styles.fieldLabel}>
					{translate('Default time range')}
				</Typography.Text>
				<SelectSimple
					className={styles.timeRangeSelect}
					testId="public-dashboard-default-time-range"
					placeholder={translate('Select default time range')}
					items={RelativeDurationOptions}
					value={defaultTimeRange}
					disabled={disabled}
					withPortal={false}
					onChange={(value): void => onDefaultTimeRangeChange(value as string)}
				/>
			</div>
		</>
	);
}

export default PublicDashboardSettingsForm;
