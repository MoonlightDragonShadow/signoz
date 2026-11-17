import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Info } from '@signozhq/icons';
import { Typography } from '@signozhq/ui/typography';

import styles from './PublicDashboardHint.module.scss';

function PublicDashboardHint(): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.hint}>
			<Info size={14} className={styles.hintIcon} />
			<Typography.Text className={styles.hintText}>
				{translate("Dashboard variables aren't supported on public links.")}
			</Typography.Text>
		</div>
	);
}

export default PublicDashboardHint;
