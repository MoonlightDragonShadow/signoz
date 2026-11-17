import ConsoleText from 'components/ConsoleText/ConsoleText';
import { Skeleton } from 'antd';
import { Badge } from '@signozhq/ui/badge';
import { Button } from '@signozhq/ui/button';
import { Info, KeyRound } from '@signozhq/icons';
import CopyIconButton from '../CopyIconButton';

import './AuthCard.styles.scss';

interface AuthCardProps {
	isAdmin: boolean;
	instanceUrl: string;
	isLoadingInstanceUrl?: boolean;
	onCopyInstanceUrl: () => void;
	onCreateServiceAccount: () => void;
}

function AuthCard({
	isAdmin,
	instanceUrl,
	isLoadingInstanceUrl = false,
	onCopyInstanceUrl,
	onCreateServiceAccount,
}: AuthCardProps): JSX.Element {
	return (
		<section className="mcp-auth-card">
			<h3 className="mcp-auth-card__title">
				<Badge color="secondary" variant="solid">
					2
				</Badge>
				<ConsoleText message={'Authenticate from your client'} />
			</h3>
			<p className="mcp-auth-card__description">
				<ConsoleText
					message={
						'On first connect, your client opens a SigNoz authorization page asking for two values:'
					}
				/>
			</p>

			<div className="mcp-auth-card__field">
				<span className="mcp-auth-card__field-label">
					<ConsoleText message={'SigNoz Instance URL'} />
				</span>
				{isLoadingInstanceUrl ? (
					<Skeleton.Input active size="small" />
				) : (
					<div className="mcp-auth-card__endpoint-value">
						<span data-testid="mcp-instance-url">{instanceUrl}</span>
						<CopyIconButton
							ariaLabel="Copy SigNoz instance URL"
							onCopy={onCopyInstanceUrl}
						/>
					</div>
				)}
			</div>

			<div className="mcp-auth-card__field">
				<span className="mcp-auth-card__field-label">
					<ConsoleText message={'API Key'} />
				</span>
				{isAdmin ? (
					<div className="mcp-auth-card__cta-row">
						<Button
							size="md"
							variant="solid"
							color="primary"
							prefix={<KeyRound size={14} />}
							onClick={onCreateServiceAccount}
						>
							<ConsoleText message={'Create service account'} />
						</Button>
						<span className="mcp-auth-card__helper-text">
							<ConsoleText
								message={
									'Create a service account, then add a new key inside it - paste that key into the API Key field.'
								}
							/>
						</span>
					</div>
				) : (
					<div className="mcp-auth-card__info-banner">
						<Info size={14} />
						<span className="mcp-auth-card__helper-text">
							<ConsoleText
								message={
									'Only admins can create API keys. Ask your workspace admin for a key with read access, then paste it into the API Key field.'
								}
							/>
						</span>
					</div>
				)}
			</div>
		</section>
	);
}

export default AuthCard;
