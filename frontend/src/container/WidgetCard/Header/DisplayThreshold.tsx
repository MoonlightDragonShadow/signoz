import ConsoleText from 'components/ConsoleText/ConsoleText';
import { SolidInfoCircle } from '@signozhq/icons';

import {
	DisplayThresholdContainer,
	TypographHeading,
	Typography,
} from 'container/WidgetCard/Header/styles';
import { DisplayThresholdProps } from 'container/WidgetCard/Header/types';

function DisplayThreshold({ threshold }: DisplayThresholdProps): JSX.Element {
	return (
		<DisplayThresholdContainer>
			<TypographHeading>
				<ConsoleText message={'Threshold'} />{' '}
			</TypographHeading>
			<Typography>{threshold || <SolidInfoCircle size="md" />}</Typography>
		</DisplayThresholdContainer>
	);
}

export default DisplayThreshold;
