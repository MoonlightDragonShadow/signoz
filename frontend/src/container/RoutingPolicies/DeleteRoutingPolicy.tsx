import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Button, Modal } from 'antd';
import { Typography } from '@signozhq/ui/typography';
import { Loader, Trash2, X } from '@signozhq/icons';

import { DeleteRoutingPolicyProps } from './types';

function DeleteRoutingPolicy({
	handleClose,
	handleDelete,
	routingPolicy,
	isDeletingRoutingPolicy,
}: DeleteRoutingPolicyProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const deleteButtonIcon = isDeletingRoutingPolicy ? (
		<Loader size={16} />
	) : (
		<Trash2 size={16} />
	);

	return (
		<Modal
			className="delete-policy-modal"
			title={
				<span className="title">{translateConsole('Delete Routing Policy')}</span>
			}
			open
			closable={false}
			onCancel={handleClose}
			footer={[
				<Button
					key="cancel"
					onClick={handleClose}
					className="cancel-btn"
					icon={<X size={16} />}
					disabled={isDeletingRoutingPolicy}
				>
					{translateConsole('Cancel')}
				</Button>,
				<Button
					key="submit"
					type="primary"
					icon={deleteButtonIcon}
					onClick={handleDelete}
					className="delete-btn"
					disabled={isDeletingRoutingPolicy}
				>
					{translateConsole('Delete Routing Policy')}
				</Button>,
			]}
		>
			<Typography.Text className="delete-text">
				<ConsoleText message={'Are you sure you want to delete'} />{' '}
				<strong>{routingPolicy?.name}</strong>{' '}
				<ConsoleText
					message={
						'routing policy? Deleting a routing policy is irreversible and cannot be undone.'
					}
				/>
			</Typography.Text>
		</Modal>
	);
}

export default DeleteRoutingPolicy;
