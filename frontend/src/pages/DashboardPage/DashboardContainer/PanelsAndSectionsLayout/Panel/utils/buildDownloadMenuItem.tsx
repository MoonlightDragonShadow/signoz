import {
	CloudDownload,
	FileCode,
	FileImage,
	FileSpreadsheet,
} from '@signozhq/icons';
import type {
	DropdownActionItemType,
	DropdownSubmenuItemType,
} from '@signozhq/ui/dropdown';
import {
	DownloadFormat,
	type PanelActionCapabilities,
} from 'pages/DashboardPage/DashboardContainer/Panels/types/panelDefinition';

const DOWNLOAD_FORMAT_OPTIONS: {
	format: DownloadFormat;
	label: string;
	icon: JSX.Element;
}[] = [
	{
		format: DownloadFormat.CSV,
		label: 'Download as CSV',
		icon: <FileSpreadsheet size={14} />,
	},
	{
		format: DownloadFormat.PNG,
		label: 'Download as PNG',
		icon: <FileImage size={14} />,
	},
	{
		format: DownloadFormat.SVG,
		label: 'Download as SVG',
		icon: <FileCode size={14} />,
	},
];

interface DownloadMenuItemArgs {
	supported?: PanelActionCapabilities['download'];
	translate?: (message: string) => string;
	onDownload: (format: DownloadFormat) => void;
}

/**
 * The "Download" submenu: one option per format the kind supports, each handing
 * the format to `onDownload`. Null when the kind supports no format.
 */
export function buildDownloadMenuItem({
	supported,
	onDownload,
	translate = (message) => message,
}: DownloadMenuItemArgs): DropdownSubmenuItemType | null {
	if (!supported) {
		return null;
	}

	const items = DOWNLOAD_FORMAT_OPTIONS.filter(
		({ format }) => supported[format],
	).map(({ format, label, icon }): DropdownActionItemType => ({
		type: 'item',
		value: `download-${format}`,
		label: translate(label),
		prefix: icon,
		onClick: (): void => onDownload(format),
	}));

	if (items.length === 0) {
		return null;
	}
	return {
		type: 'submenu',
		value: 'download',
		label: translate('Download'),
		prefix: <CloudDownload size={14} />,
		items,
	};
}
