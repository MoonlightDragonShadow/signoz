import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useCallback } from 'react';
import { Button } from '@signozhq/ui/button';
import { DrawerWrapper } from '@signozhq/ui/drawer';
import { useIntegrationModal } from 'hooks/integration/aws/useIntegrationModal';

import {
	ActiveViewEnum,
	IntegrationModalProps,
	ModalStateEnum,
} from '../../../HeroSection/types';
import CloseSetupConfirm from '../../CloseSetupConfirm/CloseSetupConfirm';
import { useCloseSetupConfirm } from '../../CloseSetupConfirm/useCloseSetupConfirm';
import { RegionForm } from '../RegionForm/RegionForm';

import './CloudAccountSetupModal.style.scss';

function CloudAccountSetupModal({
	onClose,
}: IntegrationModalProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	const {
		form,
		modalState,
		isLoading,
		activeView,
		selectedRegions,
		includeAllRegions,
		isGeneratingCommand,
		connectionCommand,
		setSelectedRegions,
		setIncludeAllRegions,
		handleRegionSelect,
		handleSubmit,
		handleClose,
		setActiveView,
		handleRegionChange,
		connectionParams,
		isConnectionParamsLoading,
		checkConnectionAgain,
	} = useIntegrationModal({ onClose });

	const { isConfirmOpen, setIsConfirmOpen, requestClose } = useCloseSetupConfirm(
		{ shouldConfirm: Boolean(connectionCommand), onClose: handleClose },
	);

	const renderContent = useCallback(() => {
		return (
			<div className="cloud-account-setup-modal__content">
				<RegionForm
					form={form}
					modalState={modalState}
					selectedRegions={selectedRegions}
					includeAllRegions={includeAllRegions}
					onRegionSelect={handleRegionSelect}
					onSubmit={handleSubmit}
					connectionCommand={connectionCommand}
					handleRegionChange={handleRegionChange}
					connectionParams={connectionParams}
					isConnectionParamsLoading={isConnectionParamsLoading}
					setSelectedRegions={setSelectedRegions}
					setIncludeAllRegions={setIncludeAllRegions}
				/>
			</div>
		);
	}, [
		modalState,
		form,
		selectedRegions,
		includeAllRegions,
		handleRegionSelect,
		handleSubmit,
		connectionCommand,
		handleRegionChange,
		connectionParams,
		isConnectionParamsLoading,
		setSelectedRegions,
		setIncludeAllRegions,
	]);

	const footer = (
		<div className="cloud-account-setup-modal__footer">
			<Button
				size="md"
				variant="outlined"
				color="secondary"
				onClick={requestClose}
				testId="aws-cancel-btn"
			>
				{translateConsole('Cancel')}
			</Button>
			{!connectionCommand && (
				<Button
					disabledTooltip={translateConsole('Select at least one region')}
					size="md"
					variant="solid"
					color="primary"
					onClick={handleSubmit}
					disabled={selectedRegions.length === 0}
					loading={isLoading || isGeneratingCommand}
					testId="aws-generate-command-btn"
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
					testId="aws-check-connection-btn"
				>
					{translateConsole('Check Again')}
				</Button>
			)}
		</div>
	);

	const getSelectedRegionsCount = useCallback(
		(): number => selectedRegions.length,
		[selectedRegions],
	);

	const getModalConfig = useCallback(() => {
		const viewConfigs = {
			[ActiveViewEnum.FORM]: {
				title: translateConsole('Add AWS Account'),
				okText: translateConsole('Generate Command'),
				onOk: handleSubmit,
				disabled:
					isLoading || isGeneratingCommand || modalState === ModalStateEnum.WAITING,
				cancelButtonProps: { style: { display: 'none' } },
			},
			[ActiveViewEnum.SELECT_REGIONS]: {
				title: translateConsole('Which regions do you want to monitor?'),
				okText: `Confirm Selection (${getSelectedRegionsCount()})`,
				onOk: (): void => setActiveView(ActiveViewEnum.FORM),
				isLoading: isLoading || isGeneratingCommand,
				cancelButtonProps: { style: { display: 'block' } },
				disabled: false,
			},
		};

		return viewConfigs[activeView];
	}, [
		translateConsole,
		modalState,
		handleSubmit,
		getSelectedRegionsCount,
		isLoading,
		isGeneratingCommand,
		activeView,
		setActiveView,
	]);

	const modalConfig = getModalConfig();

	const handleDrawerOpenChange = (open: boolean): void => {
		if (!open) {
			requestClose();
		}
	};

	return (
		<>
			<DrawerWrapper
				open={true}
				className="cloud-account-setup-modal"
				onOpenChange={handleDrawerOpenChange}
				direction="right"
				showCloseButton
				title={modalConfig.title}
				width="wide"
				footer={footer}
			>
				{renderContent()}
			</DrawerWrapper>
			<CloseSetupConfirm
				providerName="AWS"
				testIdPrefix="aws"
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				onConfirm={handleClose}
			/>
		</>
	);
}

export default CloudAccountSetupModal;
