import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useState } from 'react';
import { Button } from '@signozhq/ui/button';
import { RadioGroup } from '@signozhq/ui/radio-group';
import { Lock } from '@signozhq/icons';
import cx from 'classnames';

import styles from './SourceSelector.module.scss';

interface SourceSelectorProps {
	isOverride: boolean;
	isReadOnly: boolean;
	disableAuto?: boolean;
	onChange: (isOverride: boolean) => void;
}

// Auto-populated vs user-override selector, with a confirm step before
// discarding custom values back to defaults.
function SourceSelector({
	isOverride,
	isReadOnly,
	disableAuto = false,
	onChange,
}: SourceSelectorProps): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	const translateConsole = useConsoleTranslation();
	const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

	const handleSourceChange = (value: 'auto' | 'override'): void => {
		if (value === 'auto' && isOverride) {
			setShowResetConfirm(true);
			return;
		}
		if (value === 'override' && !isOverride) {
			onChange(true);
		}
	};

	const confirmReset = (): void => {
		onChange(false);
		setShowResetConfirm(false);
	};

	return (
		<div className={cx(styles.drawerSection, styles.drawerSurface)}>
			<div className={styles.drawerSurfaceHead}>
				<span className={styles.fieldLabel}>{translateConsole('Source')}</span>

				{isReadOnly && (
					<span className={styles.managedLabel} data-testid="drawer-managed-label">
						<Lock size={12} />
						{translateConsole('Managed by SigNoz')}
					</span>
				)}
			</div>
			<RadioGroup
				color="primary"
				textOverflow="wrap"
				value={isOverride ? 'override' : 'auto'}
				onChange={(value): void => handleSourceChange(value as 'auto' | 'override')}
				items={[
					disableAuto
						? {
								value: 'auto',
								testId: 'drawer-source-auto',
								disabled: true,
								disabledTooltip: translateInterfaceCopy(
									'Available once SigNoz has default pricing for this model.',
								),
								label: (
									<>
										<div className={styles.sourceRadioTitle}>
											{translateConsole('Auto-populated')}
										</div>
										<div className={styles.sourceRadioDesc}>
											{translateConsole(
												'Available once SigNoz has default pricing for this model.',
											)}
										</div>
									</>
								),
							}
						: {
								value: 'auto',
								testId: 'drawer-source-auto',
								label: (
									<>
										<div className={styles.sourceRadioTitle}>
											{translateConsole('Auto-populated')}
										</div>
										<div className={styles.sourceRadioDesc}>
											{translateConsole('Default pricing from SigNoz.')}
										</div>
									</>
								),
							},
					{
						value: 'override',
						testId: 'drawer-source-override',
						label: (
							<>
								<div className={styles.sourceRadioTitle}>
									{translateConsole('User override')}
								</div>
								<div className={styles.sourceRadioDesc}>
									{translateConsole('Custom pricing. Takes precedence.')}
								</div>
							</>
						),
					},
				]}
			/>
			{showResetConfirm && (
				<div
					className={styles.resetConfirm}
					aria-label={translateConsole('Reset to default pricing')}
				>
					<p>
						{translateConsole(
							'Reset to default pricing? Custom values will be discarded. It might take 24 hours for changes to take effect.',
						)}
					</p>
					<div className={styles.resetConfirmActions}>
						<Button
							size="md"
							variant="outlined"
							color="secondary"
							onClick={(): void => setShowResetConfirm(false)}
							testId="drawer-reset-keep-btn"
						>
							{translateConsole('Keep')}
						</Button>
						<Button
							size="md"
							variant="solid"
							color="primary"
							onClick={confirmReset}
							testId="drawer-reset-confirm-btn"
						>
							{translateConsole('Reset')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default SourceSelector;
