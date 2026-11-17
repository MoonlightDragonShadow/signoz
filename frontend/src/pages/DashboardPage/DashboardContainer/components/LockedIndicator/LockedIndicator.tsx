import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { LockKeyhole } from '@signozhq/icons';

import styles from './LockedIndicator.module.scss';

function LockedIndicator(): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.footer}>
			<div className={styles.lockedText} data-testid="dashboard-locked-indicator">
				<LockKeyhole size={14} />
				{translate('Locked')}
			</div>
			<div className={styles.lockedBar} />
		</div>
	);
}

export default LockedIndicator;
