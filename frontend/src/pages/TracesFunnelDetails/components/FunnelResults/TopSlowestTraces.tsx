import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useFunnelSlowTraces } from 'hooks/TracesFunnels/useFunnels';
import { FunnelStepData } from 'types/api/traceFunnels';

import FunnelTopTracesTable from './FunnelTopTracesTable';

interface TopSlowestTracesProps {
	funnelId: string;
	stepAOrder: number;
	stepBOrder: number;
	steps: FunnelStepData[];
}

function TopSlowestTraces(props: TopSlowestTracesProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<FunnelTopTracesTable
			{...props}
			title={translateConsole('Slowest 5 traces')}
			testId="funnel-slowest-traces"
			tooltip={translateConsole('A list of the slowest traces in the funnel')}
			useQueryHook={useFunnelSlowTraces}
		/>
	);
}

export default TopSlowestTraces;
