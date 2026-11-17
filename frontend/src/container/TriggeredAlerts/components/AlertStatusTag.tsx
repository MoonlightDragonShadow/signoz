import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Badge } from '@signozhq/ui/badge';

interface AlertStatusTagProps {
	state: string;
	testId?: string;
}

function AlertStatusTag({ state, testId }: AlertStatusTagProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	switch (state) {
		case 'unprocessed':
			return (
				<Badge color="success" variant="outlined" testId={testId}>
					{translateConsole('Unprocessed')}
				</Badge>
			);
		case 'active':
			return (
				<Badge color="danger" variant="outlined" testId={testId}>
					{translateConsole('Firing')}
				</Badge>
			);
		case 'suppressed':
			return (
				<Badge color="danger" variant="outlined" testId={testId}>
					{translateConsole('Suppressed')}
				</Badge>
			);
		default:
			return (
				<Badge color="secondary" variant="outlined" testId={testId}>
					{translateConsole('Unknown')}
				</Badge>
			);
	}
}

export default AlertStatusTag;
