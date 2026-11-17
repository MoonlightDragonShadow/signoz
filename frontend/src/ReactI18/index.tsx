import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { getBasePath } from 'utils/basePath';
import { getScopedKey } from 'utils/storage';

import cacheBursting from '../../i18n-translations-hash.json';

i18n.on('languageChanged', (language: string) => {
	document.documentElement.lang = language;
});

void i18n
	// load translation using http -> see /public/locales
	.use(Backend)
	// detect user language
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	.init({
		debug: false,
		// Start in Chinese when no stored language matches. Missing messages fall back to English.
		fallbackLng: (language) => (language ? ['en'] : ['zh-CN', 'en']),
		supportedLngs: ['en', 'en-GB', 'zh-CN'],
		load: 'currentOnly',
		detection: {
			order: ['localStorage'],
			caches: ['localStorage'],
			lookupLocalStorage: getScopedKey('i18nextLng'),
		},
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		backend: {
			loadPath: (languages: string[], namespaces: string[]): string => {
				const language = languages[0];
				const namespace = namespaces[0];
				const pathkey = `/${language}/${namespace}`;
				const hash = cacheBursting[pathkey as keyof typeof cacheBursting] || '';
				return hash
					? `${getBasePath()}locales/${language}/${namespace}.json?h=${hash}`
					: '';
			},
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
