import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { ILog } from 'types/api/logs/log';
import { PipelineData } from 'types/api/pipeline/def';

import LogsList from '../../../components/LogsList';
import usePipelinePreview from '../../../hooks/usePipelinePreview';

import './styles.scss';

function PipelineSimulationResult({
	inputLogs,
	pipeline,
}: PipelineSimulationResultProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { isLoading, outputLogs, isError, errorMsg } = usePipelinePreview({
		pipeline: {
			...pipeline,
			// Ensure disabled pipelines can also be previewed
			enabled: true,
		},
		inputLogs,
	});

	if (isError) {
		return (
			<div className="pipeline-simulation-error">
				<div>{translateConsole('There was an error')}</div>
				<div>{errorMsg}</div>
			</div>
		);
	}

	if (isLoading) {
		return <div>{translateConsole('Loading...')}</div>;
	}

	if (outputLogs.length < 1) {
		return <div>{translateConsole('No logs found')}</div>;
	}

	return <LogsList logs={outputLogs} />;
}

export interface PipelineSimulationResultProps {
	inputLogs: ILog[];
	pipeline: PipelineData;
}

export default PipelineSimulationResult;
