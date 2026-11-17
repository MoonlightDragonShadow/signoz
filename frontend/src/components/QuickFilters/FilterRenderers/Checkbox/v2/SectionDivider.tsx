import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Tooltip } from 'antd';
import { Typography } from '@signozhq/ui/typography';
import { Info } from '@signozhq/icons';

import styles from './SectionDivider.module.scss';

interface SectionDividerProps {
	label: string;
	tooltip?: string;
}

export function SectionDivider({
	label,
	tooltip,
}: SectionDividerProps): JSX.Element {
	const translateDisplayCopy = useConsoleTranslation();
	const testId = label.toLowerCase().replace(/\s+/g, '-');
	return (
		<div className={styles.divider} data-testid={`section-divider-${testId}`}>
			<div className={styles.line} />
			<Typography.Text className={styles.label}>
				{translateDisplayCopy(label)}
			</Typography.Text>
			{tooltip && (
				<Tooltip title={translateDisplayCopy(tooltip)}>
					<Info
						size={12}
						className={styles.infoIcon}
						data-testid="section-divider-info"
					/>
				</Tooltip>
			)}
			<div className={styles.line} />
		</div>
	);
}
