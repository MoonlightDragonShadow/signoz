import useConsoleTranslation from 'hooks/useConsoleTranslation';
import ConsoleText from 'components/ConsoleText/ConsoleText';
import { Trash2 } from '@signozhq/icons';
import { ConfirmDialog } from '@signozhq/ui/dialog';
import { Typography } from '@signozhq/ui/typography';
import ErrorInPlace from 'components/ErrorInPlace/ErrorInPlace';
import APIError from 'types/api/error';
import styles from './DeleteRoleModal.module.scss';
import { Callout } from '@signozhq/ui/callout';

interface DeleteRoleModalProps {
	isOpen: boolean;
	roleName: string;
	error: APIError | null;
	onCancel: () => void;
	onConfirm: () => Promise<boolean>;
}

function DeleteRoleModal({
	isOpen,
	roleName,
	error,
	onCancel,
	onConfirm,
}: DeleteRoleModalProps): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	const translate = useConsoleTranslation();
	return (
		<ConfirmDialog
			open={isOpen}
			onOpenChange={(next): void => {
				if (!next) {
					onCancel();
				}
			}}
			title={translate('Delete Role')}
			titleIcon={<Trash2 size={14} />}
			confirmText="Delete Role"
			confirmColor="danger"
			cancelText={translateInterfaceCopy('Cancel')}
			onConfirm={onConfirm}
			onCancel={onCancel}
			disableOutsideClick
			testId="delete-role-modal"
		>
			<Typography>
				<ConsoleText message={'Are you sure you want to delete the role'} />{' '}
				<strong>{roleName}</strong>
				<ConsoleText message={'? This action cannot be undone.'} />
			</Typography>
			{error && (
				<Callout
					title={translate('Failed to delete role')}
					color="cherry"
					className={styles.errorCallout}
				>
					<ErrorInPlace error={error} height="auto" padding={0} />
				</Callout>
			)}
		</ConfirmDialog>
	);
}

export default DeleteRoleModal;
