import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Plus } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Tooltip } from '@signozhq/ui/tooltip';

interface SectionHeaderQuickAddConfig {
	label: string;
	testId: string;
}

interface SectionHeaderQuickAddProps {
	action: SectionHeaderQuickAddConfig;
	/** Expands the section and runs the editor's registered add handler. */
	onClick: () => void;
}

/** Quick-add control rendered in a configuration section's header, beside the chevron. */
function SectionHeaderQuickAdd({
	action,
	onClick,
}: SectionHeaderQuickAddProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<Tooltip title={translate('Quick Add')} side="top">
			<Button
				type="button"
				variant="ghost"
				color="secondary"
				size="sm"
				icon
				aria-label={translate(action.label)}
				// Not `testId`: TooltipTrigger's Slot merge overwrites it with undefined.
				testId={action.testId}
				onClick={onClick}
			>
				<Plus size={15} />
			</Button>
		</Tooltip>
	);
}

export default SectionHeaderQuickAdd;
