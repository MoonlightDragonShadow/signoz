import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useCallback, useState } from 'react';
import { ChevronDown, ChevronRight, LoaderCircle } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Callout } from '@signozhq/ui/callout';
import { DrawerWrapper } from '@signozhq/ui/drawer';
import { Form, Select, Spin } from 'antd';
import { AZURE_REGIONS } from 'container/Integrations/constants';
import {
	IntegrationModalProps,
	ModalStateEnum,
} from 'container/Integrations/HeroSection/types';
import { popupContainer } from 'utils/selectPopupContainer';

import { useIntegrationModal } from '../../../../../hooks/integration/azure/useIntegrationModal';
import AgentSetupCommand from '../../AgentSetupCommand/AgentSetupCommand';
import CloseSetupConfirm from '../../CloseSetupConfirm/CloseSetupConfirm';
import { useCloseSetupConfirm } from '../../CloseSetupConfirm/useCloseSetupConfirm';
import RenderConnectionFields from '../../AmazonWebServices/RegionForm/RenderConnectionParams';

import '../../AmazonWebServices/AddNewAccount/CloudAccountSetupModal.style.scss';

function CloudAccountSetupModal({
	onClose,
}: IntegrationModalProps): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	const translateConsole = useConsoleTranslation();
	const {
		form,
		modalState,
		isLoading,
		connectionCommand,
		handleSubmit,
		handleClose,
		connectionParams,
		isConnectionParamsLoading,
		checkConnectionAgain,
	} = useIntegrationModal({ onClose });

	const { isConfirmOpen, setIsConfirmOpen, requestClose } = useCloseSetupConfirm(
		{ shouldConfirm: Boolean(connectionCommand), onClose: handleClose },
	);

	const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(true);

	const renderAlert = useCallback((): JSX.Element | null => {
		if (modalState === ModalStateEnum.WAITING) {
			return (
				<div className="cloud-account-setup-form__alert">
					<Callout
						title={
							<div className="cloud-account-setup-form__alert-message">
								<Spin indicator={<LoaderCircle size={14} className="animate-spin" />} />
								<ConsoleText
									message={'Waiting for Azure account connection, retrying in'}
								/>{' '}
								<span className="retry-time">10</span>{' '}
								<ConsoleText message={'secs...'} />
							</div>
						}
						type="info"
						showIcon={false}
					/>
				</div>
			);
		}

		if (modalState === ModalStateEnum.ERROR) {
			return (
				<div className="cloud-account-setup-form__alert">
					<Callout
						title={
							<div className="cloud-account-setup-form__alert-message">
								<ConsoleText
									message={
										"We couldn't establish a connection to your Azure account. Please try again"
									}
								/>
							</div>
						}
						type="error"
					/>
				</div>
			);
		}

		return null;
	}, [modalState]);

	const footer = (
		<div className="cloud-account-setup-modal__footer">
			<Button
				size="md"
				variant="outlined"
				color="secondary"
				onClick={requestClose}
				testId="azure-cancel-btn"
			>
				{translateConsole('Cancel')}
			</Button>
			{!connectionCommand && (
				<Button
					size="md"
					variant="solid"
					color="primary"
					onClick={handleSubmit}
					loading={isLoading}
					testId="azure-generate-command-btn"
				>
					{translateConsole('Generate Command')}
				</Button>
			)}
			{modalState === ModalStateEnum.ERROR && connectionCommand && (
				<Button
					size="md"
					variant="solid"
					color="primary"
					onClick={checkConnectionAgain}
					testId="azure-check-connection-btn"
				>
					{translateConsole('Check Again')}
				</Button>
			)}
		</div>
	);

	return (
		<>
			<DrawerWrapper
				open={true}
				className="cloud-account-setup-modal"
				onOpenChange={(open): void => {
					if (!open) {
						requestClose();
					}
				}}
				direction="right"
				showCloseButton
				title={translateConsole('Add Azure Account')}
				width="wide"
				footer={footer}
			>
				<div className="cloud-account-setup-modal__content">
					<div className="cloud-account-setup-prerequisites">
						<div className="cloud-account-setup-prerequisites__title">
							{translateConsole('Prerequisites')}
						</div>

						<ul className="cloud-account-setup-prerequisites__list">
							<li className="cloud-account-setup-prerequisites__list-item">
								<span className="cloud-account-setup-prerequisites__list-item-bullet">
									—
								</span>{' '}
								<span className="cloud-account-setup-prerequisites__list-item-text">
									<ConsoleText
										message={
											"Ensure that you're logged in to the Azure workspace which you want to monitor."
										}
									/>
								</span>
							</li>
							<li className="cloud-account-setup-prerequisites__list-item">
								<span className="cloud-account-setup-prerequisites__list-item-bullet">
									—
								</span>{' '}
								<span className="cloud-account-setup-prerequisites__list-item-text">
									<ConsoleText message={'Ensure that you either have the'} />{' '}
									<span className="cloud-account-setup-prerequisites__list-item-highlight">
										{translateConsole('Owner')}
									</span>{' '}
									<ConsoleText message={'role OR'} />
								</span>
							</li>
							<li className="cloud-account-setup-prerequisites__list-item">
								<span className="cloud-account-setup-prerequisites__list-item-bullet">
									—
								</span>{' '}
								<span className="cloud-account-setup-prerequisites__list-item-text">
									{translateConsole('Both the')}{' '}
									<span className="cloud-account-setup-prerequisites__list-item-highlight">
										{translateConsole('Contributor')}
									</span>{' '}
									<ConsoleText message={'and'} />{' '}
									<span className="cloud-account-setup-prerequisites__list-item-highlight">
										<ConsoleText message={'user access admin'} />
									</span>{' '}
									<ConsoleText message={'roles'} />
								</span>
							</li>
						</ul>
					</div>

					<div className="cloud-account-setup-how-it-works-accordion">
						<div
							className={`cloud-account-setup-how-it-works-accordion__title ${
								isHowItWorksOpen ? 'open' : ''
							}`}
						>
							<Button
								size="md"
								variant="link"
								color="secondary"
								icon
								aria-label={translateConsole('How it works')}
								onClick={(): void => setIsHowItWorksOpen(!isHowItWorksOpen)}
							>
								{isHowItWorksOpen ? <ChevronDown /> : <ChevronRight />}
							</Button>

							<span className="cloud-account-setup-how-it-works-accordion__title-text">
								{translateConsole('How it works?')}
							</span>
						</div>
						{isHowItWorksOpen && (
							<div className="cloud-account-setup-how-it-works-accordion__description">
								<div className="cloud-account-setup-how-it-works-accordion__description-item">
									<ConsoleText
										message={
											'SigNoz will create new resource-group to manage the resources required for this integration. The following steps will create a User-Assigned Managed Identity with the necessary permissions and follows the Principle of Least Privilege.'
										}
									/>
								</div>
								<div className="cloud-account-setup-how-it-works__description-item">
									<ConsoleText
										message={
											'Once the Integration template is deployed, you can enable the services you want to monitor right here in Signoz dashboard.'
										}
									/>
								</div>
							</div>
						)}
					</div>

					<Form
						form={form}
						className="cloud-account-setup-form"
						layout="vertical"
						initialValues={{ resourceGroups: [] }}
					>
						<div className="cloud-account-setup-form__content">
							{connectionCommand ? (
								<AgentSetupCommand
									description={translateInterfaceCopy(
										'Run this command in Azure Cloud Shell (Bash), or in a terminal where the Azure CLI is signed in to the subscription you want to monitor. It contains your SigNoz keys, so do not share it.',
									)}
									command={connectionCommand}
									testId="azure-agent-command"
								/>
							) : (
								<>
									<div className="cloud-account-setup-form__form-group">
										<div className="cloud-account-setup-form__title">
											{translateConsole(
												'Where should we deploy the SigNoz collector resources?',
											)}
										</div>
										<div className="cloud-account-setup-form__description">
											{translateConsole('Choose the Azure region for deployment.')}
										</div>
										<Form.Item
											name="region"
											rules={[
												{
													required: true,
													message: translateConsole('Please select a region'),
												},
											]}
											className="cloud-account-setup-form__form-item"
										>
											<Select
												placeholder={translateInterfaceCopy('e.g. East US')}
												options={AZURE_REGIONS.map((region) => ({
													label: `${region.label} (${region.value})`,
													value: region.value,
												}))}
												getPopupContainer={popupContainer}
											/>
										</Form.Item>
									</div>

									<div className="cloud-account-setup-form__form-group">
										<div className="cloud-account-setup-form__title">
											{translateConsole('Which resource groups do you want to monitor?')}
										</div>
										<div className="cloud-account-setup-form__description">
											{translateConsole('Add one or more Azure resource group names.')}
										</div>
										<Form.Item
											name="resourceGroups"
											rules={[
												{
													required: true,
													type: 'array',
													min: 1,
													message: translateConsole(
														'Please add at least one resource group',
													),
												},
											]}
											className="cloud-account-setup-form__form-item"
										>
											<Select
												mode="tags"
												placeholder={translateInterfaceCopy('e.g. prod-platform-rg')}
												tokenSeparators={[',']}
											/>
										</Form.Item>
									</div>

									<RenderConnectionFields
										isConnectionParamsLoading={isConnectionParamsLoading}
										connectionParams={connectionParams}
									/>
								</>
							)}

							{renderAlert()}

							{modalState === ModalStateEnum.WAITING && (
								<div className="cloud-account-setup-status-message">
									{translateConsole(
										'After running the command, return here and wait for automatic connection detection.',
									)}
								</div>
							)}
						</div>
					</Form>
				</div>
			</DrawerWrapper>
			<CloseSetupConfirm
				providerName="Azure"
				testIdPrefix="azure"
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				onConfirm={handleClose}
			/>
		</>
	);
}

export default CloudAccountSetupModal;
