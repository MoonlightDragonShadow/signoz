import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import useConsoleTranslation from 'hooks/useConsoleTranslation';

export default function LanguageSelector(): JSX.Element {
	const { i18n } = useTranslation();
	const id = useId();
	const translate = useConsoleTranslation();

	return (
		<div>
			<label htmlFor={id}>{translate('Language')}</label>{' '}
			<Select
				id={id}
				data-testid="interface-language-selector"
				value={i18n?.language === 'zh-CN' ? 'zh-CN' : 'en'}
				virtual={false}
				onChange={(language): void => {
					void i18n.changeLanguage(language);
				}}
				options={[
					{ value: 'en', label: <span lang="en">English</span> },
					{ value: 'zh-CN', label: <span lang="zh-CN">简体中文</span> },
				]}
			/>
		</div>
	);
}
