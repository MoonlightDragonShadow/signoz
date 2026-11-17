import type { TableColumnDef } from 'components/TanStackTableView';
import OverflowBadges from 'components/OverflowBadges/OverflowBadges';
import TanStackTable from 'components/TanStackTableView';
import { DATE_TIME_FORMATS } from 'constants/dateTimeFormats';
import { toRelativeTime } from 'pages/AlertList/NotificationChannels/utils/relativeTime';

import styles from './RoutingPolicies.module.scss';
import { RoutingPolicy } from './types';

const COLUMN_WIDTH = { default: 'auto', min: '120px' };

export function getRoutingPolicyColumns(
	formatTimezoneAdjustedTimestamp: (date: string, format: string) => string,
	translateConsole: (message: string) => string = (message) => message,
): TableColumnDef<RoutingPolicy>[] {
	const textCell = (value: string | null | undefined): JSX.Element => (
		<TanStackTable.Text title={value ?? undefined}>
			{value || '-'}
		</TanStackTable.Text>
	);

	const timestampCell = (
		row: RoutingPolicy,
		value: string | null | undefined,
	): JSX.Element => {
		if (!value) {
			return <TanStackTable.Text>-</TanStackTable.Text>;
		}

		return (
			<TanStackTable.HoverTooltip
				rowId={row.id}
				title={formatTimezoneAdjustedTimestamp(
					value,
					DATE_TIME_FORMATS.DASH_DATETIME,
				)}
			>
				<span className={styles.timeText}>{toRelativeTime(value)}</span>
			</TanStackTable.HoverTooltip>
		);
	};

	return [
		{
			id: 'name',
			header: translateConsole('Routing Policy'),
			accessorKey: 'name',
			width: COLUMN_WIDTH,
			enableSort: true,
			enableResize: true,
			enableRemove: false,
			enableMove: false,
			cell: ({ row }): JSX.Element => (
				<TanStackTable.Text
					title={row.name}
					data-testid={`routing-policy-row-${row.id}-name`}
				>
					{row.name}
				</TanStackTable.Text>
			),
		},
		{
			id: 'channels',
			header: translateConsole('Channels'),
			accessorKey: 'channels',
			width: COLUMN_WIDTH,
			enableSort: false,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element =>
				row.channels?.length ? (
					<OverflowBadges
						items={row.channels.map((channel) => ({
							key: channel,
							label: channel,
						}))}
					/>
				) : (
					<TanStackTable.Text>-</TanStackTable.Text>
				),
		},
		{
			id: 'expression',
			header: translateConsole('Expression'),
			accessorKey: 'expression',
			width: COLUMN_WIDTH,
			enableSort: false,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element => (
				<TanStackTable.Text className={styles.expression} title={row.expression}>
					{row.expression}
				</TanStackTable.Text>
			),
		},
		{
			id: 'createdBy',
			header: translateConsole('Created By'),
			accessorKey: 'createdBy',
			width: COLUMN_WIDTH,
			defaultVisibility: false,
			enableSort: false,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element => textCell(row.createdBy),
		},
		{
			id: 'createdAt',
			header: translateConsole('Created At'),
			accessorKey: 'createdAt',
			width: COLUMN_WIDTH,
			defaultVisibility: false,
			enableSort: true,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element => timestampCell(row, row.createdAt),
		},
		{
			id: 'updatedBy',
			header: translateConsole('Updated By'),
			accessorKey: 'updatedBy',
			width: COLUMN_WIDTH,
			defaultVisibility: false,
			enableSort: false,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element => textCell(row.updatedBy),
		},
		{
			id: 'updatedAt',
			header: translateConsole('Updated At'),
			accessorKey: 'updatedAt',
			width: COLUMN_WIDTH,
			defaultVisibility: false,
			enableSort: true,
			enableResize: true,
			enableMove: false,
			cell: ({ row }): JSX.Element => timestampCell(row, row.updatedAt),
		},
	];
}
