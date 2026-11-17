import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';

import styles from './NoRuleEmptyState.module.scss';

interface NoRuleEmptyStateProps {
	canManage: boolean;
	onSetup: () => void;
}

function NoRuleEmptyState({
	canManage,
	onSetup,
}: NoRuleEmptyStateProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.emptyState} data-testid="volume-control-empty">
			<Typography.Text size="small" color="muted">
				{translate(
					'No volume control rule. All series are retained. Aggregate away high-cardinality attributes to reduce cost.',
				)}
			</Typography.Text>
			{canManage && (
				<Button
					size="md"
					variant="solid"
					color="primary"
					onClick={onSetup}
					testId="volume-control-setup"
				>
					{translate('Set up volume control')}
				</Button>
			)}
		</div>
	);
}

export default NoRuleEmptyState;
