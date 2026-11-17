import useConsoleTranslation from 'hooks/useConsoleTranslation';
import DateTimeSelectionV2 from 'container/TopNav/DateTimeSelectionV2';

import './StepsHeader.styles.scss';

function StepsHeader(): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<div className="steps-header">
			<div className="steps-header__label">{translateConsole('FUNNEL STEPS')}</div>
			<div className="steps-header__time-range">
				<DateTimeSelectionV2
					showAutoRefresh={false}
					showRefreshText={false}
					hideShareModal
					showRecentlyUsed={false}
				/>
			</div>
		</div>
	);
}

export default StepsHeader;
