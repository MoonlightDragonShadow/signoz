import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { SampleLogsResponse } from '../../hooks/useSampleLogs';
import LogsList from '../LogsList';

function SampleLogsResponseDisplay({
	response,
}: SampleLogsResponseDisplayProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { isLoading, isError, logs } = response;

	if (isError) {
		return (
			<div className="sample-logs-notice-container">
				{translateConsole('An error occured while querying sample logs')}
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="sample-logs-notice-container">
				{translateConsole('Loading...')}
			</div>
		);
	}

	if (logs.length < 1) {
		return (
			<div className="sample-logs-notice-container">
				{translateConsole('No logs found')}
			</div>
		);
	}

	return <LogsList logs={logs} />;
}

export interface SampleLogsResponseDisplayProps {
	response: SampleLogsResponse;
}

export default SampleLogsResponseDisplay;
