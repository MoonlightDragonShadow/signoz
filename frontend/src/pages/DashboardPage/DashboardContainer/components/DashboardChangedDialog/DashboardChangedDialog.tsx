import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { RotateCcw } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { DialogWrapper } from '@signozhq/ui/dialog';
import logEvent from 'api/common/logEvent';
import { DashboardDetailEvents } from 'pages/DashboardPage/constants/events';

import { useDashboardStore } from '../../store/useDashboardStore';
import styles from './DashboardChangedDialog.module.scss';

interface DashboardChangedDialogProps {
	open: boolean;
	onReload: () => void;
	onDismiss: () => void;
}

function DashboardChangedDialog({
	open,
	onReload,
	onDismiss,
}: DashboardChangedDialogProps): JSX.Element {
	const translate = useConsoleTranslation();
	const dashboardId = useDashboardStore((s) => s.dashboardId);

	const handleReload = (): void => {
		void logEvent(DashboardDetailEvents.StaleReloadPrompted, {
			dashboardId,
			action: 'reload',
		});
		onReload();
	};

	const handleDismiss = (): void => {
		void logEvent(DashboardDetailEvents.StaleReloadPrompted, {
			dashboardId,
			action: 'dismiss',
		});
		onDismiss();
	};

	const footer = (
		<div className={styles.footer}>
			<Button
				size="md"
				variant="solid"
				color="secondary"
				onClick={handleDismiss}
				testId="dashboard-changed-dismiss"
			>
				{translate('Dismiss')}
			</Button>
			<Button
				size="md"
				variant="solid"
				color="primary"
				prefix={<RotateCcw size={12} />}
				onClick={handleReload}
				testId="dashboard-changed-reload"
			>
				{translate('Reload')}
			</Button>
		</div>
	);

	return (
		<DialogWrapper
			open={open}
			onOpenChange={(isOpen): void => {
				if (!isOpen) {
					onDismiss();
				}
			}}
			title={translate('Dashboard updated elsewhere')}
			width="narrow"
			showCloseButton={false}
			footer={footer}
		>
			<div className={styles.body}>
				{translate(
					'This dashboard was changed in another tab or by another user. Reload to see the latest version.',
				)}
			</div>
		</DialogWrapper>
	);
}

export default DashboardChangedDialog;
