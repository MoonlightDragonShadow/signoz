import ROUTES from 'constants/routes';
import AllErrorsContainer from 'container/AllError';

export const routes = [
	{
		Component: AllErrorsContainer,
		name: 'All Exceptions',
		route: ROUTES.ALL_ERROR,
		key: ROUTES.ALL_ERROR,
	},
];
