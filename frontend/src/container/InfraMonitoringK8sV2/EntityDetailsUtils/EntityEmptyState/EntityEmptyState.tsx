import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Typography } from '@signozhq/ui/typography';

import emptyStateUrl from '@/assets/Icons/emptyState.svg';

import styles from './EntityEmptyState.module.scss';

interface EntityEmptyStateProps {
	hasFilters: boolean;
}

export default function EntityEmptyState({
	hasFilters,
}: EntityEmptyStateProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.container} data-testid="entity-empty-state">
			<div className={styles.content}>
				<img src={emptyStateUrl} alt="empty-state" className={styles.icon} />
				{hasFilters ? (
					<Typography.Text>
						<span className={styles.title}>
							{translate('This query had no results.')}{' '}
						</span>
						{translate('Edit your query and try again!')}
					</Typography.Text>
				) : (
					<Typography.Text>
						<span className={styles.title}>{translate('No data yet.')} </span>
						{translate('When we receive data, it will show up here.')}
					</Typography.Text>
				)}
			</div>
		</div>
	);
}
