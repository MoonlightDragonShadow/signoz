import useConsoleTranslation from 'hooks/useConsoleTranslation';
import useSampleLogs, { SampleLogsRequest } from '../../hooks/useSampleLogs';
import LogsResponseDisplay from './SampleLogsResponseDisplay';

function SampleLogs(props: SampleLogsRequest): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const sampleLogsResponse = useSampleLogs(props);

	if ((props?.filter?.items?.length || 0) < 1) {
		return (
			<div className="sample-logs-notice-container">
				{translateConsole('Please select a filter')}
			</div>
		);
	}

	return <LogsResponseDisplay response={sampleLogsResponse} />;
}

export default SampleLogs;
