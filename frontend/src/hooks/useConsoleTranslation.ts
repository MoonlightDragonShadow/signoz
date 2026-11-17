import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Console copy uses the original English text as the key and fallback.
export default function useConsoleTranslation(): (
	message: string,
	values?: Record<string, unknown>,
) => string {
	const { t } = useTranslation('console');

	return useCallback(
		(message: string, values?: Record<string, unknown>): string =>
			t(message, {
				...values,
				defaultValue: message,
				keySeparator: false,
				nsSeparator: false,
			}),
		[t],
	);
}
