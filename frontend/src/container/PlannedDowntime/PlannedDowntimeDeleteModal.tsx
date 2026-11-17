import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { SetStateAction } from 'react';
import { Button, Modal } from 'antd';
import { Typography } from '@signozhq/ui/typography';
import { Trash2, X } from '@signozhq/icons';

import './PlannedDowntime.styles.scss';

interface PlannedDowntimeDeleteModalProps {
	isDeleteModalOpen: boolean;
	setIsDeleteModalOpen: (value: SetStateAction<boolean>) => void;
	onDeleteHandler: () => void;
	isDeleteLoading: boolean;
	downtimeSchedule: string;
}

export function PlannedDowntimeDeleteModal(
	props: PlannedDowntimeDeleteModalProps,
): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const {
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		isDeleteLoading,
		onDeleteHandler,
		downtimeSchedule,
	} = props;
	const hideDeleteScheduleModal = (): void => {
		setIsDeleteModalOpen(false);
	};
	return (
		<Modal
			className="delete-schedule-modal"
			title={<span className="title">{translateConsole('Delete Schedule')}</span>}
			open={isDeleteModalOpen}
			closable={false}
			onCancel={hideDeleteScheduleModal}
			footer={[
				<Button
					key="cancel"
					onClick={hideDeleteScheduleModal}
					className="cancel-btn"
					icon={<X size={16} />}
				>
					{translateConsole('Cancel')}
				</Button>,
				<Button
					key="submit"
					icon={<Trash2 size={16} />}
					onClick={onDeleteHandler}
					className="delete-btn"
					disabled={isDeleteLoading}
				>
					{translateConsole('Delete Schedule')}
				</Button>,
			]}
		>
			<Typography.Text className="delete-text">
				{`Are you sure you want to delete - ${downtimeSchedule} schedule? Deleting a schedule is irreversible and cannot be undone.`}
			</Typography.Text>
		</Modal>
	);
}
