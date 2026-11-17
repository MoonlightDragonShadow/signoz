import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useMemo } from 'react';
import { EllipsisVertical, Pencil, Trash2 } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Dropdown, type DropdownItemType } from '@signozhq/ui/dropdown';

import type { DraftGroup } from 'container/LLMObservability/AttributeMapping/types';

interface GroupActionsMenuProps {
	group: DraftGroup;
	onEdit: (group: DraftGroup) => void;
	onRemove: (localId: string) => void;
}

function GroupActionsMenu({
	group,
	onEdit,
	onRemove,
}: GroupActionsMenuProps): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	const translateConsole = useConsoleTranslation();
	const menuItems = useMemo<DropdownItemType[]>(
		() => [
			{
				type: 'item',
				value: 'edit',
				label: translateInterfaceCopy('Edit'),
				prefix: <Pencil size={14} />,
				onClick: (): void => onEdit(group),
			},
			{
				type: 'item',
				value: 'delete',
				label: translateInterfaceCopy('Delete'),
				danger: true,
				prefix: <Trash2 size={14} />,
				onClick: (): void => onRemove(group.localId),
			},
		],
		[onEdit, onRemove, group],
	);

	return (
		<Dropdown items={menuItems} nativeButton align="end" side="bottom">
			<Button
				variant="ghost"
				color="secondary"
				size="sm"
				icon
				aria-label={translateConsole('Group actions')}
				testId={`group-actions-${group.localId}`}
			>
				<EllipsisVertical size={16} />
			</Button>
		</Dropdown>
	);
}

export default GroupActionsMenu;
