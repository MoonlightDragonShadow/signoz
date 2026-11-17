import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { LayoutGrid } from '@signozhq/icons';

import Spinner from 'components/Spinner';
import HeaderRightSection from 'components/HeaderRightSection/HeaderRightSection';
import { useDashboardCollectionPermissions } from 'hooks/dashboards/useDashboardCollectionPermissions';
import DashboardsList from './components/DashboardsList/DashboardsList';

import styles from './DashboardsListPage.module.scss';
import { BreadcrumbLink } from '@signozhq/ui/breadcrumb';

function DashboardsListPage(): JSX.Element {
	const translate = useConsoleTranslation();
	// Resolved before the list mounts, so no control renders enabled-then-disabled.
	const { isLoading } = useDashboardCollectionPermissions();

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<BreadcrumbLink icon={<LayoutGrid size={14} />}>
						{translate('Dashboard')}
					</BreadcrumbLink>
				</div>
				<HeaderRightSection
					enableAnnouncements={false}
					enableShare
					enableFeedback
				/>
			</div>
			{isLoading ? (
				<Spinner tip={translate('Loading dashboards...')} />
			) : (
				<DashboardsList />
			)}
		</div>
	);
}

export default DashboardsListPage;
