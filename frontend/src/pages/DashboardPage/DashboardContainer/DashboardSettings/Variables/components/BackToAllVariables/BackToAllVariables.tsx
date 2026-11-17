import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { ArrowLeft } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import styles from './BackToAllVariables.module.scss';
import { VariableFormProps } from '../../types';

const BackToAllVariables = ({
	onClose,
}: {
	onClose: VariableFormProps['onClose'];
}): JSX.Element => {
	const translate = useConsoleTranslation();
	return (
		<div className={styles.backToAllVariables}>
			<Button
				variant="ghost"
				color="secondary"
				prefix={<ArrowLeft size={14} />}
				onClick={onClose}
				testId="variable-form-back"
				size="md"
			>
				{translate('All variables')}
			</Button>
		</div>
	);
};

export default BackToAllVariables;
