import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Color } from '@signozhq/design-tokens';
import { useIsDarkMode } from 'hooks/useDarkMode';
import { BellOff, CircleCheck, CircleOff, Flame } from '@signozhq/icons';
import { RuletypesAlertStateDTO } from 'api/generated/services/sigNoz.schemas';

import './AlertState.styles.scss';

type AlertStateProps = {
	state: RuletypesAlertStateDTO | string;
	showLabel?: boolean;
	testId?: string;
};

export default function AlertState({
	state,
	showLabel,
	testId,
}: AlertStateProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	let icon;
	let label;
	const isDarkMode = useIsDarkMode();
	switch (state) {
		case RuletypesAlertStateDTO.nodata:
			icon = (
				<CircleOff
					size={18}
					fill={Color.BG_SIENNA_400}
					color={Color.BG_SIENNA_400}
				/>
			);
			label = (
				<span style={{ color: Color.BG_SIENNA_400 }}>
					{translateConsole('No Data')}
				</span>
			);
			break;

		case RuletypesAlertStateDTO.disabled:
			icon = (
				<BellOff
					size={18}
					fill={Color.BG_VANILLA_400}
					color={Color.BG_VANILLA_400}
				/>
			);
			label = (
				<span style={{ color: Color.BG_VANILLA_400 }}>
					{translateConsole('Muted')}
				</span>
			);
			break;

		case RuletypesAlertStateDTO.firing:
			icon = (
				<Flame size={18} fill={Color.BG_CHERRY_500} color={Color.BG_CHERRY_500} />
			);
			label = (
				<span style={{ color: Color.BG_CHERRY_500 }}>
					{translateConsole('Firing')}
				</span>
			);
			break;

		case RuletypesAlertStateDTO.inactive:
		case 'normal': // legacy
			icon = (
				<CircleCheck
					size={18}
					fill={Color.BG_FOREST_500}
					color={isDarkMode ? Color.BG_INK_400 : Color.BG_VANILLA_100}
				/>
			);
			label = (
				<span style={{ color: Color.BG_FOREST_500 }}>
					{translateConsole('Resolved')}
				</span>
			);
			break;

		default:
			icon = null;
	}

	return (
		<div className="alert-state" data-testid={testId}>
			{icon} {showLabel && <div className="alert-state__label">{label}</div>}
		</div>
	);
}

AlertState.defaultProps = {
	showLabel: false,
	testId: undefined,
};
