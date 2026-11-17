import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Check, Trash2, X } from '@signozhq/icons';
import { AlertDialog } from '@signozhq/ui/alert-dialog';
import { Button } from '@signozhq/ui/button';
import { Typography } from '@signozhq/ui/typography';

import { DeleteSavedViewDialogProps } from './types';

function DeleteSavedViewDialog({
	isDeleting,
	onCancel,
	onConfirm,
}: DeleteSavedViewDialogProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<AlertDialog
			open
			onOpenChange={(isOpen): void => {
				if (!isOpen) {
					onCancel();
				}
			}}
			width="narrow"
			title={translateConsole('Delete this view')}
			titleIcon={<Trash2 size={16} />}
			footer={
				<>
					<Button
						size="md"
						variant="solid"
						color="secondary"
						onClick={onCancel}
						prefix={<X size={12} />}
						testId="delete-saved-view-cancel"
					>
						{translateConsole('Cancel')}
					</Button>
					<Button
						size="md"
						variant="solid"
						color="danger"
						loading={isDeleting}
						onClick={onConfirm}
						prefix={<Check size={12} />}
						testId="delete-saved-view-confirm"
					>
						{translateConsole('Delete view')}
					</Button>
				</>
			}
		>
			<Typography.Text>
				{translateConsole(
					'Deleting this view is irreversible and cannot be undone.',
				)}
			</Typography.Text>
		</AlertDialog>
	);
}

export default DeleteSavedViewDialog;
