import { TabRoutes } from 'components/RouteTab/types';
import ROUTES from 'constants/routes';
import ExplorerPage from 'container/MetricsExplorer/Explorer';
import SummaryPage from 'container/MetricsExplorer/Summary';
import VolumeControlTab from 'container/MetricsExplorer/VolumeControl/components/VolumeControlTab/VolumeControlTab';
import { BarChart, Compass, Gauge } from '@signozhq/icons';

export const getSummaryRoute = (
	translate: (message: string) => string,
): TabRoutes => ({
	Component: SummaryPage,
	name: (
		<div className="tab-item">
			<BarChart size={16} /> {translate('Summary')}
		</div>
	),
	route: ROUTES.METRICS_EXPLORER,
	key: ROUTES.METRICS_EXPLORER,
});

export const getExplorerRoute = (
	translate: (message: string) => string,
): TabRoutes => ({
	Component: (): JSX.Element => <ExplorerPage />,
	name: (
		<div className="tab-item">
			<Compass size={16} /> {translate('Explorer')}
		</div>
	),
	route: ROUTES.METRICS_EXPLORER_EXPLORER,
	key: ROUTES.METRICS_EXPLORER_EXPLORER,
});

export const getVolumeControlRoute = (
	translate: (message: string) => string,
): TabRoutes => ({
	Component: VolumeControlTab,
	name: (
		<div className="tab-item">
			<Gauge size={16} /> {translate('Volume Control')}
		</div>
	),
	route: ROUTES.METRICS_EXPLORER_VOLUME_CONTROL,
	key: ROUTES.METRICS_EXPLORER_VOLUME_CONTROL,
});
