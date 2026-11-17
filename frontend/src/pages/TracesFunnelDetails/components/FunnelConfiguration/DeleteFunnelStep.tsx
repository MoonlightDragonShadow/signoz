import useConsoleTranslation from 'hooks/useConsoleTranslation';
import SignozModal from 'components/SignozModal/SignozModal';
import { Trash2, X } from '@signozhq/icons';
import { useFunnelContext } from 'pages/TracesFunnels/FunnelContext';

import './DeleteFunnelStep.styles.scss';

interface DeleteFunnelStepProps {
	isOpen: boolean;
	onClose: () => void;
	onStepRemove: () => void;
}

function DeleteFunnelStep({
	isOpen,
	onClose,
	onStepRemove,
}: DeleteFunnelStepProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const { handleRunFunnel } = useFunnelContext();
	const handleStepRemoval = (): void => {
		onStepRemove();
		handleRunFunnel();
		onClose();
	};

	return (
		<SignozModal
			open={isOpen}
			title={translateConsole('Delete this step')}
			width={390}
			onCancel={onClose}
			rootClassName="funnel-modal delete-funnel-modal"
			cancelText={translateConsole('Cancel')}
			okText={translateConsole('Delete Step')}
			okButtonProps={{
				icon: <Trash2 size={14} />,
				type: 'primary',
				className: 'funnel-modal__ok-btn',
				onClick: handleStepRemoval,
			}}
			cancelButtonProps={{
				icon: <X size={14} />,
				type: 'text',
				className: 'funnel-modal__cancel-btn',
				onClick: onClose,
			}}
			destroyOnClose
		>
			<div className="delete-funnel-modal-content">
				{translateConsole(
					'Deleting this step would stop further analytics using this step of the funnel.',
				)}
			</div>
		</SignozModal>
	);
}

export default DeleteFunnelStep;
