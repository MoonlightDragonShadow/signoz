import ConsoleText from 'components/ConsoleText/ConsoleText';
import NotFoundImage from 'assets/NotFound';
import ROUTES from 'constants/routes';

import { defaultText } from './constant';
import { Button, Container, Text, TextContainer } from './styles';

function NotFound({ text = defaultText }: Props): JSX.Element {
	return (
		<Container data-testid="not-found">
			<NotFoundImage />

			<TextContainer>
				<Text>{text}</Text>
				<Text>
					<ConsoleText message={'Page Not Found'} />
				</Text>
			</TextContainer>

			<Button to={ROUTES.HOME} tabIndex={0}>
				<ConsoleText message={'Return Home'} />
			</Button>
		</Container>
	);
}

interface Props {
	text?: string;
}

NotFound.defaultProps = {
	text: defaultText,
};

export default NotFound;
