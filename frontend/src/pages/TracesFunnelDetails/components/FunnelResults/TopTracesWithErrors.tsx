import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useFunnelErrorTraces } from 'hooks/TracesFunnels/useFunnels';
import { FunnelStepData } from 'types/api/traceFunnels';

import FunnelTopTracesTable from './FunnelTopTracesTable';

interface TopTracesWithErrorsProps {
	funnelId: string;
	stepAOrder: number;
	stepBOrder: number;
	steps: FunnelStepData[];
}

function TopTracesWithErrors(props: TopTracesWithErrorsProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<FunnelTopTracesTable
			{...props}
			title={translateConsole('Traces with errors')}
			testId="funnel-error-traces"
			tooltip={translateConsole('A list of the traces with errors in the funnel')}
			useQueryHook={useFunnelErrorTraces}
		/>
	);
}

export default TopTracesWithErrors;
