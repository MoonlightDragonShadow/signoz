import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useCallback, useState } from 'react';
import { Style } from '@signozhq/design-tokens';
import { CircleHelp } from '@signozhq/icons';
import { Callout } from '@signozhq/ui/callout';
import { Checkbox } from '@signozhq/ui/checkbox';
import { Input } from '@signozhq/ui/input';
import { Form, Tooltip } from 'antd';

import ClaimMappingSection from './components/ClaimMappingSection';
import RoleMappingSection from './components/RoleMappingSection';

import './Providers.styles.scss';

type ExpandedSection = 'claim-mapping' | 'role-mapping' | null;

function ConfigureOIDCAuthnProvider({
	isCreate,
}: {
	isCreate: boolean;
}): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	const translateConsole = useConsoleTranslation();
	const form = Form.useFormInstance();

	const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);

	const handleClaimMappingChange = useCallback((expanded: boolean): void => {
		setExpandedSection(expanded ? 'claim-mapping' : null);
	}, []);

	const handleRoleMappingChange = useCallback((expanded: boolean): void => {
		setExpandedSection(expanded ? 'role-mapping' : null);
	}, []);

	return (
		<div className="authn-provider">
			<section className="authn-provider__header">
				<h3 className="authn-provider__title">
					{translateConsole('Edit OIDC Authentication')}
				</h3>
				<p className="authn-provider__description">
					<ConsoleText
						message={
							'Configure OpenID Connect Single Sign-On with your Identity Provider. Read the'
						}
					/>{' '}
					<a
						href="https://signoz.io/docs/manage/administrator-guide/sso/overview/"
						target="_blank"
						rel="noreferrer"
					>
						{translateConsole('docs')}
					</a>{' '}
					{translateConsole('for more information.')}
				</p>
			</section>

			<div className="authn-provider__columns">
				{/* Left Column - Core OIDC Settings */}
				<div className="authn-provider__left">
					<div className="authn-provider__field-group">
						<label className="authn-provider__label" htmlFor="oidc-domain">
							{translateConsole('Domain')}
							<Tooltip
								title={
									<ConsoleText
										message={
											'The email domain for users who should use SSO (e.g., `example.com` for users with `@example.com` emails)'
										}
									/>
								}
							>
								<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
							</Tooltip>
						</label>
						<Form.Item
							name="name"
							className="authn-provider__form-item"
							rules={[
								{
									required: true,
									message: translateInterfaceCopy('Domain is required'),
									whitespace: true,
								},
							]}
						>
							<Input id="oidc-domain" disabled={!isCreate} />
						</Form.Item>
					</div>

					<div className="authn-provider__field-group">
						<label className="authn-provider__label" htmlFor="oidc-issuer">
							{translateConsole('Issuer URL')}
							<Tooltip
								title={translateInterfaceCopy(
									'The URL identifier for the OIDC provider. For example: "https://accounts.google.com" or "https://login.salesforce.com".',
								)}
							>
								<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
							</Tooltip>
						</label>
						<Form.Item
							name={['oidcConfig', 'issuer']}
							className="authn-provider__form-item"
							rules={[
								{
									required: true,
									message: translateInterfaceCopy('Issuer URL is required'),
									whitespace: true,
								},
							]}
						>
							<Input id="oidc-issuer" />
						</Form.Item>
					</div>

					<div className="authn-provider__field-group">
						<label className="authn-provider__label" htmlFor="oidc-issuer-alias">
							{translateConsole('Issuer Alias')}
							<Tooltip
								title={
									<ConsoleText
										message={
											'Optional: Override the issuer URL from .well-known/openid-configuration for providers like Azure or Oracle IDCS.'
										}
									/>
								}
							>
								<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
							</Tooltip>
						</label>
						<Form.Item
							name={['oidcConfig', 'issuerAlias']}
							className="authn-provider__form-item"
						>
							<Input id="oidc-issuer-alias" />
						</Form.Item>
					</div>

					<div className="authn-provider__field-group">
						<label className="authn-provider__label" htmlFor="oidc-client-id">
							{translateConsole('Client ID')}
							<Tooltip
								title={
									<ConsoleText
										message={"The application's client ID from your OIDC provider."}
									/>
								}
							>
								<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
							</Tooltip>
						</label>
						<Form.Item
							name={['oidcConfig', 'clientId']}
							className="authn-provider__form-item"
							rules={[
								{
									required: true,
									message: translateInterfaceCopy('Client ID is required'),
									whitespace: true,
								},
							]}
						>
							<Input id="oidc-client-id" />
						</Form.Item>
					</div>

					<div className="authn-provider__field-group">
						<label className="authn-provider__label" htmlFor="oidc-client-secret">
							{translateConsole('Client Secret')}
							<Tooltip
								title={
									<ConsoleText
										message={"The application's client secret from your OIDC provider."}
									/>
								}
							>
								<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
							</Tooltip>
						</label>
						<Form.Item
							name={['oidcConfig', 'clientSecret']}
							className="authn-provider__form-item"
							rules={[
								{
									required: true,
									message: translateInterfaceCopy('Client Secret is required'),
									whitespace: true,
								},
							]}
						>
							<Input id="oidc-client-secret" />
						</Form.Item>
					</div>

					<div className="authn-provider__checkbox-row">
						<Form.Item
							name={['oidcConfig', 'insecureSkipEmailVerified']}
							valuePropName="value"
							noStyle
						>
							<Checkbox
								color="primary"
								id="oidc-skip-email-verification"
								onChange={(checked: boolean): void => {
									form.setFieldValue(
										['oidcConfig', 'insecureSkipEmailVerified'],
										checked,
									);
								}}
							>
								{translateConsole('Skip Email Verification')}
							</Checkbox>
						</Form.Item>
						<Tooltip
							title={translateInterfaceCopy(
								'Whether to skip email verification. Defaults to "false"',
							)}
						>
							<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
						</Tooltip>
					</div>

					<div className="authn-provider__checkbox-row">
						<Form.Item
							name={['oidcConfig', 'getUserInfo']}
							valuePropName="value"
							noStyle
						>
							<Checkbox
								color="primary"
								id="oidc-get-user-info"
								onChange={(checked: boolean): void => {
									form.setFieldValue(['oidcConfig', 'getUserInfo'], checked);
								}}
							>
								{translateConsole('Get User Info')}
							</Checkbox>
						</Form.Item>
						<Tooltip
							title={
								<ConsoleText
									message={
										'Use the userinfo endpoint to get additional claims. Useful when providers return thin ID tokens.'
									}
								/>
							}
						>
							<CircleHelp size={14} color={Style.L3_FOREGROUND} cursor="help" />
						</Tooltip>
					</div>
					<div className="authn-provider__callout-wrapper">
						<Callout type="warning" size="small" showIcon className="callout">
							<ConsoleText
								message={
									"OIDC won't be enabled unless you enter all the attributes above"
								}
							/>
						</Callout>
					</div>
				</div>

				{/* Right Column - Advanced Settings */}
				<div className="authn-provider__right">
					<ClaimMappingSection
						fieldNamePrefix={['oidcConfig', 'claimMapping']}
						isExpanded={expandedSection === 'claim-mapping'}
						onExpandChange={handleClaimMappingChange}
					/>

					<RoleMappingSection
						fieldNamePrefix={['roleMapping']}
						isExpanded={expandedSection === 'role-mapping'}
						onExpandChange={handleRoleMappingChange}
					/>
				</div>
			</div>
		</div>
	);
}

export default ConfigureOIDCAuthnProvider;
