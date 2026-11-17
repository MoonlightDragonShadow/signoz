import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Button } from '@signozhq/ui/button';
import { DialogWrapper } from '@signozhq/ui/dialog';
import { Typography } from '@signozhq/ui/typography';

interface CloseSetupConfirmProps {
	/** Provider name as shown in the title, e.g. `AWS`. */
	providerName: string;
	/** Prefix for the dialog's test ids, e.g. `aws`. */
	testIdPrefix: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

function CloseSetupConfirm({
	providerName,
	testIdPrefix,
	open,
	onOpenChange,
	onConfirm,
}: CloseSetupConfirmProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<DialogWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={`Close ${providerName} agent setup?`}
			testId={`${testIdPrefix}-close-setup-confirm`}
			footer={
				<>
					<Button
						size="md"
						variant="solid"
						color="highlight-danger"
						onClick={onConfirm}
						testId={`${testIdPrefix}-close-setup-btn`}
					>
						{translateConsole('Close Setup')}
					</Button>
					<Button
						size="md"
						variant="solid"
						color="primary"
						onClick={(): void => onOpenChange(false)}
						testId={`${testIdPrefix}-continue-setup-btn`}
					>
						{translateConsole('Continue Setup')}
					</Button>
				</>
			}
		>
			<Typography>
				<ConsoleText
					message={
						'The agent has not connected yet. If you close now, you will have to start the installation process again with a new setup command.'
					}
				/>
			</Typography>
		</DialogWrapper>
	);
}

export default CloseSetupConfirm;
