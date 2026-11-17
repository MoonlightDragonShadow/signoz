import ConsoleText from 'components/ConsoleText/ConsoleText';
import { Typography } from '@signozhq/ui/typography';

function AnnouncementsModal(): JSX.Element {
	return (
		<div className="announcements-modal-container">
			<div className="announcements-modal-container-header">
				<Typography.Text className="announcements-modal-title">
					<ConsoleText message={'Announcements'} />
				</Typography.Text>
			</div>
		</div>
	);
}

export default AnnouncementsModal;
