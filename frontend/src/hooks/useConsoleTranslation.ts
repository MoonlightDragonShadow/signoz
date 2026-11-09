import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Console copy uses the original English text as the key and fallback.
export default function useConsoleTranslation(): (message: string) => string {
	const { t } = useTranslation('console');

	return useCallback(
		(message: string): string =>
			t(message, {
				defaultValue: message,
				keySeparator: false,
				nsSeparator: false,
			}),
		[t],
	);
}
