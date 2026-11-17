import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Group, Info } from '@signozhq/icons';
import { Tooltip } from '@signozhq/ui/tooltip';

import styles from './EntityGroupHeader.module.scss';
import { DOCS_BASE_URL } from 'constants/app';

const DOCS_ROOT = `${DOCS_BASE_URL}/docs`;

interface EntityGroupHeaderProps {
	title: string;
	icon?: React.ReactNode;
	docPath?: string;
	tooltip?: string;
}

function EntityGroupHeader({
	title,
	icon,
	docPath,
	tooltip,
}: EntityGroupHeaderProps): JSX.Element {
	const translate = useConsoleTranslation();
	const renderInfoIcon = (): React.ReactNode => {
		if (docPath) {
			const tooltipTitle = tooltip || 'Not sure what this means?';
			return (
				<Tooltip
					title={
						<>
							{translate(tooltipTitle)}{' '}
							<a
								href={`${DOCS_ROOT}${docPath}`}
								target="_blank"
								rel="noopener"
								onClick={(e): void => e.stopPropagation()}
							>
								{translate('Learn more.')}
							</a>
						</>
					}
				>
					<span className={styles.infoIcon}>
						<Info size="md" />
					</span>
				</Tooltip>
			);
		}

		if (tooltip) {
			return (
				<Tooltip title={translate(tooltip)}>
					<span className={styles.infoIcon}>
						<Info size="md" />
					</span>
				</Tooltip>
			);
		}

		return null;
	};

	return (
		<div className={styles.entityGroupHeader} data-slot="entity-group-header">
			<span data-slot="icon">
				{icon || <Group size={14} data-hide-expanded="true" />}
			</span>{' '}
			{translate(title)}
			{renderInfoIcon()}
		</div>
	);
}

export default EntityGroupHeader;
