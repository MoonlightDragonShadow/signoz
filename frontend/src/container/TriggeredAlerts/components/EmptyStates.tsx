import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useCallback } from 'react';
import { CircleCheck, Plus, RefreshCw } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import ROUTES from 'constants/routes';
import { useSafeNavigate } from 'hooks/useSafeNavigate';
import { isModifierKeyPressed } from 'utils/app';

import styles from './EmptyStates.module.scss';

interface EmptyStateProps {
	onRefresh?: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { safeNavigate } = useSafeNavigate();

	const handleCreateAlert = useCallback(
		(e: React.MouseEvent): void => {
			safeNavigate(ROUTES.ALERTS_NEW, { newTab: isModifierKeyPressed(e) });
		},
		[safeNavigate],
	);

	return (
		<div className={styles.emptyState}>
			<CircleCheck className={styles.emptyStateIcon} size={16} />
			<div className={styles.emptyStateTitle}>
				{translateConsole('No alerts firing')}
			</div>
			<div className={styles.emptyStateSubtitle}>
				{translateConsole(
					'All systems are healthy. No alerts are currently triggered.',
				)}
			</div>
			<div className={styles.emptyStateActions}>
				<Button
					size="md"
					variant="solid"
					color="primary"
					prefix={<Plus size={14} />}
					onClick={handleCreateAlert}
					testId="triggered-alerts-empty-create-button"
				>
					{translateConsole('Create Alert Rule')}
				</Button>
				{onRefresh && (
					<Button
						size="md"
						variant="outlined"
						color="secondary"
						prefix={<RefreshCw size={14} />}
						onClick={onRefresh}
						testId="triggered-alerts-empty-refresh-button"
					>
						{translateConsole('Refresh')}
					</Button>
				)}
			</div>
		</div>
	);
}
