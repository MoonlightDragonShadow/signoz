import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useLocation } from 'react-use';
import RouteTab from 'components/RouteTab';
import { TabRoutes } from 'components/RouteTab/types';

import { getHostsRoute, getKubernetesRoute } from './constants';

import './InfrastructureMonitoring.styles.scss';

export default function InfrastructureMonitoringPage(): JSX.Element {
	const translate = useConsoleTranslation();
	const { pathname } = useLocation();

	const routes: TabRoutes[] = [
		getHostsRoute(translate),
		getKubernetesRoute(translate),
	];

	return (
		<RouteTab
			className="infra-monitoring-module-container"
			routes={routes}
			activeKey={pathname}
		/>
	);
}
