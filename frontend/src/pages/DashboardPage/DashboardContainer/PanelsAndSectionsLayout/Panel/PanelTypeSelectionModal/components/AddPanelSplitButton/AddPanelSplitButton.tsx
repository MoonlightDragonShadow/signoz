import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useMemo } from 'react';
import { ChevronUp, Plus } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Dropdown, type DropdownItemType } from '@signozhq/ui/dropdown';

import type { SectionOption } from '../../types';

import styles from './AddPanelSplitButton.module.scss';

interface AddPanelSplitButtonProps {
	label: string;
	options: SectionOption[];
	value: string | null;
	onChange: (value: string) => void;
	onCreate: () => void;
	onConfirm: () => void;
	disabled: boolean;
}

function AddPanelSplitButton({
	label,
	options,
	value,
	onChange,
	onCreate,
	onConfirm,
	disabled,
}: AddPanelSplitButtonProps): JSX.Element {
	const translate = useConsoleTranslation();
	const items = useMemo<DropdownItemType[]>(
		() => [
			{
				type: 'group',
				value: 'sections',
				label: translate('Add to section'),
				items: [
					{
						type: 'radio-group',
						name: 'section',
						value: value ?? '',
						onChange,
						items: options.map((option) => ({
							value: option.value,
							label: option.isRoot ? translate(option.label) : option.label,
							testId: `panel-section-option-${option.value}`,
						})),
					},
				],
			},
			{ type: 'separator', value: 'create-separator' },
			{
				type: 'item',
				value: 'create',
				label: translate('New section'),
				prefix: <Plus size={14} />,
				onClick: onCreate,
				testId: 'panel-section-create',
			},
		],
		[translate, options, value, onChange, onCreate],
	);

	return (
		<div className={styles.splitButton}>
			<Button
				variant="solid"
				color="primary"
				size="md"
				onClick={onConfirm}
				disabled={disabled}
				disabledTooltip={translate('Name the new section first')}
				testId="panel-type-confirm"
			>
				{label}
			</Button>
			<Dropdown
				items={items}
				nativeButton
				side="top"
				align="end"
				contentMaxWidth={320}
			>
				<Button
					variant="solid"
					color="primary"
					size="md"
					icon
					aria-label={translate('Choose section')}
				>
					<ChevronUp size={16} />
				</Button>
			</Dropdown>
		</div>
	);
}

export default AddPanelSplitButton;
