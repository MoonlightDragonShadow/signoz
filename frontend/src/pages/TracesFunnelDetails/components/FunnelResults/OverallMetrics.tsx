import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useAppParams } from 'lib/router/useAppParams';
import { useFunnelMetrics } from 'hooks/TracesFunnels/useFunnelMetrics';

import FunnelMetricsTable from './FunnelMetricsTable';

function OverallMetrics(): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { funnelId } = useAppParams<'funnelId'>();
	const { isLoading, metricsData, conversionRate, isError } = useFunnelMetrics({
		funnelId: funnelId || '',
	});

	return (
		<FunnelMetricsTable
			title={translateConsole('Overall Funnel Metrics')}
			subtitle={{
				label: 'Conversion rate',
				value: `${conversionRate.toFixed(2)}%`,
			}}
			isLoading={isLoading}
			isError={isError}
			data={metricsData}
		/>
	);
}

export default OverallMetrics;
