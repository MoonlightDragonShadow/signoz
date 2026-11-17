import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { Clock } from '@signozhq/icons';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { localizeRelativeTime } from 'components/LocalizedRelativeTime/localizeRelativeTime';

import { RefreshTextContainer } from './styles';

function RefreshText({
	onLastRefreshHandler,
	refreshButtonHidden,
}: RefreshTextProps): JSX.Element {
	const translate = useConsoleTranslation();
	const [refreshText, setRefreshText] = useState<string>('');

	// this is to update the refresh text
	useEffect(() => {
		const interval = setInterval(() => {
			const text = onLastRefreshHandler();
			if (refreshText !== text) {
				setRefreshText(text);
			}
		}, 2000);
		return (): void => {
			clearInterval(interval);
		};
	}, [onLastRefreshHandler, refreshText]);

	return (
		<RefreshTextContainer refreshButtonHidden={refreshButtonHidden}>
			<Tooltip title={localizeRelativeTime(refreshText, translate)}>
				<Clock size={12} />
			</Tooltip>
		</RefreshTextContainer>
	);
}

interface RefreshTextProps {
	onLastRefreshHandler: () => string;
	refreshButtonHidden: boolean;
}

export default RefreshText;
