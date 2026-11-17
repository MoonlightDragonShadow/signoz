import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Modal, ModalProps } from 'antd';

import './SignozModal.style.scss';

function SignozModal({
	children,
	width = 672,
	rootClassName = '',
	...rest
}: ModalProps): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	return (
		<Modal
			centered
			width={width}
			cancelText={translateInterfaceCopy('Close')}
			rootClassName={`signoz-modal ${rootClassName}`}
			{...rest}
		>
			{children}
		</Modal>
	);
}

export default SignozModal;
