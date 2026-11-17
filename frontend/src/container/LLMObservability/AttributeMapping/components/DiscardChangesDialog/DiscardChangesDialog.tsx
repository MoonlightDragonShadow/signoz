import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { AlertDialog } from '@signozhq/ui/alert-dialog';
import { Button } from '@signozhq/ui/button';
import { Trash2, X } from '@signozhq/icons';

interface DiscardChangesDialogProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

function DiscardChangesDialog({
	open,
	onConfirm,
	onCancel,
}: DiscardChangesDialogProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen): void => {
				if (!isOpen) {
					onCancel();
				}
			}}
			width="narrow"
			title={translateConsole('Discard unsaved changes?')}
			titleIcon={<Trash2 size={16} />}
			footer={
				<>
					<Button
						size="md"
						variant="solid"
						color="secondary"
						onClick={onCancel}
						prefix={<X size={12} />}
						testId="discard-changes-cancel-btn"
					>
						{translateConsole('Keep editing')}
					</Button>
					<Button
						size="md"
						variant="solid"
						color="danger"
						onClick={onConfirm}
						prefix={<Trash2 size={12} />}
						testId="discard-changes-confirm-btn"
					>
						{translateConsole('Discard changes')}
					</Button>
				</>
			}
		>
			{translateConsole(
				'This reverts every unsaved group and mapping change back to the last saved state. This action cannot be undone.',
			)}
		</AlertDialog>
	);
}

export default DiscardChangesDialog;
