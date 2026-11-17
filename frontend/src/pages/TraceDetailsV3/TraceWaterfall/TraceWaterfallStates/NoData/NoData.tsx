import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Typography } from '@signozhq/ui/typography';

interface INoDataProps {
	id: string;
}

function NoData(props: INoDataProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { id } = props;
	return (
		<Typography.Text>
			{translateConsole('No Trace found with the id:')} {id}{' '}
		</Typography.Text>
	);
}

export default NoData;
