import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';
import { PanelLeftClose, PanelLeftOpen } from '@signozhq/icons';

import styles from './StatusBar.module.scss';

interface Props {
	collapsed: boolean;
	onToggleCollapse: () => void;
	count: number;
	total: number;
}

function StatusBar({
	collapsed,
	onToggleCollapse,
	count,
	total,
}: Props): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.statusBar}>
			<Button
				variant="ghost"
				color="secondary"
				size="sm"
				prefix={
					collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />
				}
				onClick={onToggleCollapse}
				testId="dashboards-rail-toggle"
			>
				{collapsed ? translate('Expand') : translate('Collapse')}
			</Button>
			<Typography.Text className={styles.count}>
				{count} {translate('of')} {total} {translate('dashboards')}
			</Typography.Text>
		</div>
	);
}

export default StatusBar;
