import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Plus } from '@signozhq/icons';
import AuthZButton from 'lib/authz/components/AuthZButton/AuthZButton';
import { DashboardCreatePermission } from 'lib/authz/hooks/useAuthZ/permissions/dashboard.permissions';

const CHECKS = [DashboardCreatePermission];

interface Props {
	onClick: () => void;
}

function NewDashboardButton({ onClick }: Props): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<AuthZButton
			size="md"
			checks={CHECKS}
			variant="solid"
			color="primary"
			prefix={<Plus size={14} />}
			onClick={onClick}
			testId="new-dashboard-cta"
		>
			{translate('New dashboard')}
		</AuthZButton>
	);
}

export default NewDashboardButton;
