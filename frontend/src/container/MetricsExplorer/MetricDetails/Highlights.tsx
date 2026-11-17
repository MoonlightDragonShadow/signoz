import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { localizeRelativeTime } from 'components/LocalizedRelativeTime/localizeRelativeTime';
import { Color } from '@signozhq/design-tokens';
import { Button, Spin } from 'antd';
import { Tooltip } from '@signozhq/ui/tooltip';
import { Typography } from '@signozhq/ui/typography';
import { useGetMetricHighlights } from 'api/generated/services/metrics';
import { DATE_TIME_FORMATS } from 'constants/dateTimeFormats';
import { Info } from '@signozhq/icons';
import { useTimezone } from 'providers/Timezone';

import { formatNumberIntoHumanReadableFormat } from '../Summary/utils';
import { HighlightsProps } from './types';
import {
	formatNumberToCompactFormat,
	formatTimestampToReadableDate,
} from './utils';

function Highlights({ metricName }: HighlightsProps): JSX.Element {
	const translateRuntimeCopy = useConsoleTranslation();
	const translate = useConsoleTranslation();
	const {
		data: metricHighlightsData,
		isLoading: isLoadingMetricHighlights,
		isError: isErrorMetricHighlights,
		refetch: refetchMetricHighlights,
	} = useGetMetricHighlights(
		{
			metricName,
		},
		{
			query: {
				enabled: !!metricName,
			},
		},
	);

	const metricHighlights = metricHighlightsData?.data;

	const timeSeriesActive = formatNumberToCompactFormat(
		metricHighlights?.activeTimeSeries,
	);
	const timeSeriesTotal = formatNumberToCompactFormat(
		metricHighlights?.totalTimeSeries,
	);
	const lastReceivedText = formatTimestampToReadableDate(
		metricHighlights?.lastReceived,
	);
	const { formatTimezoneAdjustedTimestamp } = useTimezone();
	const lastReceivedTooltipText = metricHighlights?.lastReceived
		? translateRuntimeCopy('Last received on {{value1}}', {
				value1: formatTimezoneAdjustedTimestamp(
					metricHighlights.lastReceived,
					DATE_TIME_FORMATS.DASH_DATETIME_UTC,
				),
			})
		: translate('No data received yet');

	if (isErrorMetricHighlights) {
		return (
			<div className="metric-details-content-grid">
				<div
					className="metric-highlights-error-state"
					data-testid="metric-highlights-error-state"
				>
					<Info size={16} color={Color.BG_CHERRY_500} />
					<Typography.Text>
						{translate('Something went wrong while fetching metric highlights')}
					</Typography.Text>
					<Button
						type="link"
						size="large"
						onClick={(): void => {
							refetchMetricHighlights();
						}}
					>
						{translate('Retry ?')}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="metric-details-content-grid">
			<div className="labels-row">
				<Typography.Text color="muted" className="metric-details-grid-label">
					{translate('SAMPLES')}
				</Typography.Text>
				<Typography.Text color="muted" className="metric-details-grid-label">
					{translate('TIME SERIES')}
				</Typography.Text>
				<Typography.Text color="muted" className="metric-details-grid-label">
					{translate('LAST RECEIVED')}
				</Typography.Text>
			</div>
			<div className="values-row">
				{isLoadingMetricHighlights ? (
					<div className="metric-highlights-loading-inline">
						<Spin size="small" />
						<Typography.Text color="muted">
							{translate('Loading metric stats')}
						</Typography.Text>
					</div>
				) : (
					<>
						<Typography.Text
							className="metric-details-grid-value"
							data-testid="metric-highlights-data-points"
						>
							<Tooltip title={metricHighlights?.dataPoints?.toLocaleString()}>
								<span>
									{formatNumberIntoHumanReadableFormat(
										metricHighlights?.dataPoints ?? 0,
									)}
								</span>
							</Tooltip>
						</Typography.Text>
						<Typography.Text
							className="metric-details-grid-value"
							data-testid="metric-highlights-time-series-total"
						>
							<Tooltip
								title={translate(
									'Active time series are those that have received data points in the last 1 hour.',
								)}
								side="top"
							>
								<span>
									{translate('{{value1}} total ⎯ {{value2}} active', {
										value1: timeSeriesTotal,
										value2: timeSeriesActive,
									})}
								</span>
							</Tooltip>
						</Typography.Text>
						<Typography.Text
							className="metric-details-grid-value"
							data-testid="metric-highlights-last-received"
						>
							<Tooltip title={lastReceivedTooltipText}>
								<span>{localizeRelativeTime(lastReceivedText, translate)}</span>
							</Tooltip>
						</Typography.Text>
					</>
				)}
			</div>
		</div>
	);
}

export default Highlights;
