import { TabRoutes } from 'components/RouteTab/types';
import ROUTES from 'constants/routes';
import ExplorerPage from 'container/ApiMonitoring/Explorer/Explorer';
import { Compass } from '@signozhq/icons';

export const getExplorerRoute = (
	translate: (message: string) => string,
): TabRoutes => ({
	Component: ExplorerPage,
	name: (
		<div className="tab-item">
			<Compass size={16} /> {translate('Explorer')}
		</div>
	),
	route: ROUTES.API_MONITORING,
	key: ROUTES.API_MONITORING,
});
