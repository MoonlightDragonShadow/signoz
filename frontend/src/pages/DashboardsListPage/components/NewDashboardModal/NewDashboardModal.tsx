import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useEffect, useState } from 'react';
import { DialogWrapper } from '@signozhq/ui/dialog';
import { Tabs } from '@signozhq/ui/tabs';
import logEvent from 'api/common/logEvent';
import { DashboardListEvents } from 'pages/DashboardsListPage/constants/events';

import BlankDashboardPanel from './BlankDashboardPanel';
import ImportJsonPanel from './ImportJsonPanel';
import TemplatesPanel from './TemplatesPanel';

interface Props {
	open: boolean;
	onClose: () => void;
}

function NewDashboardModal({ open, onClose }: Props): JSX.Element {
	const translate = useConsoleTranslation();
	const [tab, setTab] = useState('blank');

	useEffect(() => {
		if (open) {
			setTab('blank');
		}
	}, [open]);

	const handleTabChange = (key: string): void => {
		setTab(key);
		void logEvent(DashboardListEvents.CreateModalTabChanged, { tab: key });
	};

	return (
		<DialogWrapper
			title={translate('New dashboard')}
			open={open}
			width="wide"
			onOpenChange={(next): void => {
				if (!next) {
					onClose();
				}
			}}
		>
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				value={tab}
				onChange={handleTabChange}
				items={[
					{
						key: 'blank',
						label: translate('Blank'),
						children: <BlankDashboardPanel onClose={onClose} />,
					},
					{
						key: 'template',
						label: translate('From a template'),
						children: <TemplatesPanel />,
					},
					{
						key: 'import',
						label: translate('Import JSON'),
						children: <ImportJsonPanel onClose={onClose} />,
					},
				]}
			/>
		</DialogWrapper>
	);
}

export default NewDashboardModal;
