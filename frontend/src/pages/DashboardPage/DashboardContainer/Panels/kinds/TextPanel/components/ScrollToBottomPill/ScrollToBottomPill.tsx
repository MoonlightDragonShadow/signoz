import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { ChevronsDown } from '@signozhq/icons';

import styles from './ScrollToBottomPill.module.scss';

interface ScrollToBottomPillProps {
	onClick: () => void;
}

function ScrollToBottomPill({ onClick }: ScrollToBottomPillProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<button
			type="button"
			className={styles.pill}
			onClick={onClick}
			data-testid="text-panel-scroll-more"
		>
			<ChevronsDown size={14} />
			<span>{translate('Scroll for more')}</span>
		</button>
	);
}

export default ScrollToBottomPill;
