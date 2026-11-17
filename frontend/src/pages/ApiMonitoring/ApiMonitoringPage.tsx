import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useLocation } from 'react-use';
import RouteTab from 'components/RouteTab';
import { TabRoutes } from 'components/RouteTab/types';

import { getExplorerRoute } from './constants';

import './ApiMonitoringPage.styles.scss';

function ApiMonitoringPage(): JSX.Element {
	const translate = useConsoleTranslation();
	const { pathname } = useLocation();

	const routes: TabRoutes[] = [getExplorerRoute(translate)];

	return (
		<RouteTab
			className="api-monitoring-page"
			routes={routes}
			activeKey={pathname}
		/>
	);
}

export default ApiMonitoringPage;
