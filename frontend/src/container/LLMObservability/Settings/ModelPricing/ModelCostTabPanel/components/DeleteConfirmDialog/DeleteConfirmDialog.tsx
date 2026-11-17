import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { AlertDialog } from '@signozhq/ui/alert-dialog';
import { Button } from '@signozhq/ui/button';
import { Trash2, X } from '@signozhq/icons';

interface DeleteConfirmDialogProps {
	open: boolean;
	modelName: string;
	isDeleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

// Confirmation step before deleting a model cost — deletion is irreversible, so
// the destructive action is gated behind an explicit confirm. AlertDialog blocks
// outside-click dismissal and hides the close button to force an explicit choice.
function DeleteConfirmDialog({
	open,
	modelName,
	isDeleting,
	onConfirm,
	onCancel,
}: DeleteConfirmDialogProps): JSX.Element {
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
			title={translateConsole('Delete Model Cost Data ')}
			titleIcon={<Trash2 size={16} />}
			footer={
				<>
					<Button
						size="md"
						variant="solid"
						color="secondary"
						onClick={onCancel}
						prefix={<X size={12} />}
						testId="drawer-delete-cancel-btn"
					>
						{translateConsole('Cancel')}
					</Button>
					<Button
						size="md"
						variant="solid"
						color="danger"
						loading={isDeleting}
						onClick={onConfirm}
						prefix={<Trash2 size={12} />}
						testId="drawer-delete-confirm-btn"
					>
						{translateConsole('Delete')}
					</Button>
				</>
			}
		>
			{translateConsole('Are you sure you want to delete')}{' '}
			<strong>{modelName}</strong>
			{translateConsole('? Once deleted, this action cannot be undone.')}
		</AlertDialog>
	);
}

export default DeleteConfirmDialog;
