import { Typography } from '@signozhq/ui/typography';
import useConsoleTranslation from 'hooks/useConsoleTranslation';

import {
	EntityProgressBarType,
	THRESHOLDS_BY_TYPE,
} from './EntityProgressBar.utils';
import styles from './EntityProgressThresholds.module.scss';

interface EntityProgressThresholdsProps {
	type: EntityProgressBarType;
	note?: string;
}

export function EntityProgressThresholds({
	type,
	note,
}: EntityProgressThresholdsProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div
			className={styles.container}
			data-testid={`entity-progress-thresholds-${type}`}
		>
			{note && (
				<Typography.Text as="p" size="small">
					{translate(note)}
				</Typography.Text>
			)}
			{THRESHOLDS_BY_TYPE[type].map((threshold) => (
				<div key={threshold.range} className={styles.threshold}>
					<span
						className={styles.swatch}
						style={{ '--ept-color': threshold.color } as React.CSSProperties}
					/>
					<div className={styles.thresholdBody}>
						<div className={styles.thresholdHeading}>
							<Typography.Text as="span" size="small" weight="medium">
								{translate(threshold.label)}
							</Typography.Text>
							<Typography.Text
								as="span"
								size="small"
								color="muted"
								className={styles.range}
							>
								{threshold.range}
							</Typography.Text>
						</div>
						<Typography.Text as="p" size="small" color="muted">
							{translate(threshold.description)}
						</Typography.Text>
					</div>
				</div>
			))}
		</div>
	);
}
