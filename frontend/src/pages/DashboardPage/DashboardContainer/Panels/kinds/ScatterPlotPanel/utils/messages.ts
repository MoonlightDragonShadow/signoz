import type { PanelStatusDetail } from 'pages/DashboardPage/DashboardContainer/PanelsAndSectionsLayout/Panel/PanelStatus/types';

import { formatGroupByMismatch, type QueryGroupBy } from './groupByMismatch';
import { MAX_PLOTTED_GROUPS } from './prepareData';
import {
	ScatterDimension,
	type ScatterPlotData,
	ScatterPlotDataStatus,
	type StaleDimension,
} from '../types';

export interface ScatterPlotMessage {
	title: string;
	description: string;
}

/** Why returned groups plot nothing; undefined for plain no-data or when something plots. */
export function getScatterPlotEmptyMessage(
	data: ScatterPlotData,
	mismatch: QueryGroupBy[] | null = null,
	translate: (message: string) => string = (message) => message,
): ScatterPlotMessage | undefined {
	if (data.totalGroups === 0) {
		return undefined;
	}
	if (data.status === ScatterPlotDataStatus.NeedsSecondValue) {
		return {
			title: translate('Add a second aggregation or query'),
			description: translate(
				'Each dot needs two values, one for X and one for Y. Add an aggregation to this query, or another query grouped by the same labels.',
			),
		};
	}
	if (data.drawnGroups > 0) {
		return undefined;
	}
	const title = translate(
		data.totalGroups === 1
			? '0 of %total% group plotted'
			: '0 of %total% groups plotted',
	).replace('%total%', String(data.totalGroups));
	if (data.missingValueGroups === 0) {
		return {
			title,
			description: translate(
				data.nonPositiveOnLogGroups === 1
					? "%count% group with a value ≤ 0 can't go on a log axis. Switch the axis to symlog to show them."
					: "%count% groups with a value ≤ 0 can't go on a log axis. Switch the axis to symlog to show them.",
			).replace('%count%', String(data.nonPositiveOnLogGroups)),
		};
	}
	return {
		title,
		description: mismatch
			? translate(
					"Queries are grouped by different labels (%labels%), so their groups don't line up. Change any query's group by to apply it to all.",
				).replace('%labels%', () => formatGroupByMismatch(mismatch))
			: translate(
					'No group has both an X and a Y value. Group every query by exactly the same labels; a group missing from one query has no dot.',
				),
	};
}

const STALE_FALLBACK: Record<ScatterDimension, string> = {
	[ScatterDimension.X]: 'X falls back to Auto',
	[ScatterDimension.Y]: 'Y falls back to Auto',
	[ScatterDimension.Size]: 'every dot is one size',
	[ScatterDimension.Color]: "it's left out of the color",
};

function staleNote(
	{ dimension, key }: StaleDimension,
	translate: (message: string) => string,
): string {
	return translate(
		"%dimension% uses %key%, which isn't in the results, so %fallback%.",
	)
		.replace('%dimension%', () => dimension)
		.replace('%key%', () => key)
		.replace('%fallback%', () => translate(STALE_FALLBACK[dimension]));
}

function formatCount(count: number): string {
	return count.toLocaleString('en-US');
}

/** Groups left out and stale dimensions; null when nothing to say or nothing plots. */
export function getScatterPlotWarning(
	data: ScatterPlotData,
	mismatch: QueryGroupBy[] | null = null,
	translate: (message: string) => string = (message) => message,
): PanelStatusDetail | null {
	if (data.status !== ScatterPlotDataStatus.Ready || data.drawnGroups === 0) {
		return null;
	}
	const atCap = data.cappedGroups > 0 || data.totalGroups === MAX_PLOTTED_GROUPS;
	const groupsLeftOut = atCap || data.drawnGroups < data.totalGroups;
	const messages = [
		...data.staleDimensions.map((dimension) => staleNote(dimension, translate)),
		atCap && translate('Add a filter or narrow the group by to see the rest.'),
		data.missingValueGroups > 0 &&
			translate(
				data.missingValueGroups === 1
					? '%count% group missing an X or Y value.'
					: '%count% groups missing an X or Y value.',
			).replace('%count%', formatCount(data.missingValueGroups)),
		data.missingValueGroups > 0 &&
			mismatch &&
			translate(
				"Queries are grouped by different labels (%labels%), so their groups don't line up. Change any query's group by to apply it to all.",
			).replace('%labels%', () => formatGroupByMismatch(mismatch)),
		data.nonPositiveOnLogGroups > 0 &&
			translate(
				data.nonPositiveOnLogGroups === 1
					? "%count% group with a value ≤ 0 can't go on a log axis. Switch the axis to symlog to show them."
					: "%count% groups with a value ≤ 0 can't go on a log axis. Switch the axis to symlog to show them.",
			).replace('%count%', String(data.nonPositiveOnLogGroups)),
	].filter((message): message is string => Boolean(message));
	if (messages.length === 0) {
		return null;
	}
	return {
		message: atCap
			? translate('Showing the first %drawn% groups.').replace(
					'%drawn%',
					formatCount(data.drawnGroups),
				)
			: groupsLeftOut
				? translate('Showing %drawn% of %total% groups.')
						.replace('%drawn%', formatCount(data.drawnGroups))
						.replace('%total%', formatCount(data.totalGroups))
				: translate("Some dimensions aren't in the results."),
		messages,
	};
}
