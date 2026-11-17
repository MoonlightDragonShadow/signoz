import useConsoleTranslation from 'hooks/useConsoleTranslation';

import { localizeRelativeTime } from './localizeRelativeTime';

export default function LocalizedRelativeTime({
	value,
}: {
	value: string;
}): JSX.Element {
	const translate = useConsoleTranslation();
	return <>{localizeRelativeTime(value, translate)}</>;
}
