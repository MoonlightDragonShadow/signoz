import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Modal } from 'antd';
import { Typography } from '@signozhq/ui/typography';

interface FirstSectionMigrationModalProps {
	open: boolean;
	isSaving: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

/**
 * Shown when the user adds the first section to a free-flowing dashboard that
 * already has panels. Confirms grouping the existing panels into a section
 * before proceeding.
 */
function FirstSectionMigrationModal({
	open,
	isSaving,
	onClose,
	onConfirm,
}: FirstSectionMigrationModalProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<Modal
			open={open}
			title={translate('Group panels into sections?')}
			onCancel={onClose}
			onOk={onConfirm}
			okText={translate('Continue')}
			okButtonProps={{ disabled: isSaving, 'data-testid': 'confirm-migration' }}
			destroyOnClose
		>
			<Typography.Text>
				{translate(
					"This dashboard's panels are currently free-flowing. Adding a section will move the existing panels into their own section, and a new empty section will be added below. You can rename sections afterwards.",
				)}
			</Typography.Text>
		</Modal>
	);
}

export default FirstSectionMigrationModal;
