import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { ExternalLink, SolidInfoCircle } from '@signozhq/icons';
import { Tooltip } from '@signozhq/ui/tooltip';
import { Typography } from '@signozhq/ui/typography';
import logEvent from 'api/common/logEvent';
import { Events } from 'constants/events';
import { DashboardDetailEvents } from 'pages/DashboardPage/constants/events';
import { useDashboardCursorSyncMode } from 'hooks/dashboard/useDashboardCursorSyncMode';
import { useSyncTooltipFilterMode } from 'hooks/dashboard/useSyncTooltipFilterMode';
import {
	DashboardCursorSync,
	SyncTooltipFilterMode,
} from 'lib/uPlotV2/plugins/TooltipPlugin/types';
import { getAbsoluteUrl } from 'utils/basePath';
import cx from 'classnames';

import SegmentedControl from '../SegmentedControl/SegmentedControl';
import settingsStyles from '../../DashboardSettings.module.scss';
import styles from './CrossPanelSync.module.scss';

interface CrossPanelSyncProps {
	dashboardId: string;
}

function CrossPanelSync({ dashboardId }: CrossPanelSyncProps): JSX.Element {
	const translate = useConsoleTranslation();
	const [cursorSyncMode, setCursorSyncMode] =
		useDashboardCursorSyncMode(dashboardId);
	const [syncTooltipFilterMode, setSyncTooltipFilterMode] =
		useSyncTooltipFilterMode(dashboardId);

	const handleCursorSyncChange = (value: DashboardCursorSync): void => {
		void logEvent(DashboardDetailEvents.CursorSyncChanged, {
			mode: value,
			dashboardId,
		});
		setCursorSyncMode(value);
	};

	const handleTooltipFilterModeChange = (value: SyncTooltipFilterMode): void => {
		void logEvent(Events.TOOLTIP_SYNC_MODE_CHANGED, {
			path: getAbsoluteUrl(window.location.pathname),
			mode: value,
		});
		setSyncTooltipFilterMode(value);
	};

	return (
		<div className={cx(settingsStyles.settingsCard, styles.crossPanelSyncGroup)}>
			<div className={styles.crossPanelSyncSectionHeader}>
				<Typography.Text className={styles.crossPanelsSyncSectionTitle}>
					{translate('Cross-Panel Sync')}
				</Typography.Text>

				<Tooltip
					side="top"
					title={
						<div className={styles.crossPanelSyncTooltipContent}>
							<strong className={styles.crossPanelSyncTooltipTitle}>
								{translate('Cross-Panel Sync')}
							</strong>
							<span className={styles.crossPanelSyncTooltipDescription}>
								{translate(
									'Sync crosshair and tooltip across all the dashboard panels',
								)}
							</span>
							<Typography.Link
								href="https://signoz.io/docs/dashboards/interactivity/#cross-panel-sync"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.crossPanelSyncTooltipDocLink}
							>
								{translate('Learn more')}
								<ExternalLink size={12} />
							</Typography.Link>
						</div>
					}
				>
					<SolidInfoCircle size="md" className={styles.crossPanelSyncInfoIcon} />
				</Tooltip>
			</div>

			<div className={styles.crossPanelSyncRow}>
				<div className={styles.crossPanelSyncInfo}>
					<Typography.Text className={styles.crossPanelSyncTitle}>
						{translate('Sync Mode')}
					</Typography.Text>
					<Typography.Text className={styles.crossPanelSyncDescription}>
						{translate('Sync crosshair and tooltip across all the dashboard panels')}
					</Typography.Text>
				</div>
				<SegmentedControl
					testId="cursor-sync-mode"
					value={cursorSyncMode}
					onChange={handleCursorSyncChange}
					options={[
						{ label: translate('No Sync'), value: DashboardCursorSync.None },
						{ label: translate('Crosshair'), value: DashboardCursorSync.Crosshair },
						{ label: translate('Tooltip'), value: DashboardCursorSync.Tooltip },
					]}
				/>
			</div>

			{cursorSyncMode === DashboardCursorSync.Tooltip && (
				<div className={styles.crossPanelSyncRow}>
					<div className={styles.crossPanelSyncInfo}>
						<Typography.Text className={styles.crossPanelSyncTitle}>
							{translate('Synced Tooltip Series')}
						</Typography.Text>
						<Typography.Text className={styles.crossPanelSyncDescription}>
							{translate(
								'Show only series that intersect on group-by, or every series with the matching ones highlighted',
							)}
						</Typography.Text>
					</div>

					<SegmentedControl
						testId="sync-tooltip-filter-mode"
						value={syncTooltipFilterMode}
						onChange={handleTooltipFilterModeChange}
						options={[
							{ label: translate('All'), value: SyncTooltipFilterMode.All },
							{ label: translate('Filtered'), value: SyncTooltipFilterMode.Filtered },
						]}
					/>
				</div>
			)}
		</div>
	);
}

export default CrossPanelSync;
