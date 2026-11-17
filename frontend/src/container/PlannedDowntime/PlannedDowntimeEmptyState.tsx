import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { CalendarClock, Plus } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';

import styles from './PlannedDowntime.module.scss';

const DOCS_URL =
	'https://signoz.io/docs/alerts-management/planned-maintenance/';

interface PlannedDowntimeEmptyStateProps {
	canCreate: boolean;
	onCreate: () => void;
}

function PlannedDowntimeEmptyState({
	canCreate,
	onCreate,
}: PlannedDowntimeEmptyStateProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<div className={styles.emptyState} data-testid="planned-downtime-empty-state">
			<CalendarClock className={styles.emptyIcon} size={16} />
			<Typography.Text className={styles.emptyTitle}>
				{translateConsole('No planned downtime yet')}
			</Typography.Text>
			<Typography.Text className={styles.emptySubtitle}>
				{translateConsole(
					'A planned downtime silences alert rules for a window you schedule, once or on repeat, so maintenance does not page anyone.',
				)}
			</Typography.Text>
			{canCreate && (
				<Button
					variant="solid"
					color="primary"
					size="md"
					prefix={<Plus size={14} />}
					onClick={onCreate}
					testId="planned-downtime-empty-create"
				>
					{translateConsole('New downtime')}
				</Button>
			)}
			<a
				className={styles.docsLink}
				href={DOCS_URL}
				target="_blank"
				rel="noopener noreferrer"
			>
				{translateConsole('Read the planned downtime guide')}
			</a>
		</div>
	);
}

export default PlannedDowntimeEmptyState;
