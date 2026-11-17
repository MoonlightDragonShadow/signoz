import ConsoleText from 'components/ConsoleText/ConsoleText';
import { useEffect } from 'react';
import { Button, Col, Modal, Row, Skeleton, Space } from 'antd';
import { Typography } from '@signozhq/ui/typography';
import ROUTES from 'constants/routes';
import { navigate } from 'lib/router/navigation';
import { useAppContext } from 'providers/App/App';
import { LicensePlatform, LicenseState } from 'types/api/licensesV3/getActive';

import featureGraphicCorrelationUrl from '@/assets/Images/feature-graphic-correlation.svg';

import './WorkspaceAccessRestricted.styles.scss';

function WorkspaceAccessRestricted(): JSX.Element {
	const { activeLicense, isFetchingActiveLicense } = useAppContext();

	useEffect(() => {
		if (!isFetchingActiveLicense) {
			const isTerminated = activeLicense?.state === LicenseState.TERMINATED;
			const isExpired = activeLicense?.state === LicenseState.EXPIRED;
			const isCancelled = activeLicense?.state === LicenseState.CANCELLED;

			const isWorkspaceAccessRestricted = isTerminated || isExpired || isCancelled;

			if (
				!isWorkspaceAccessRestricted ||
				activeLicense.platform === LicensePlatform.SELF_HOSTED
			) {
				navigate(ROUTES.HOME);
			}
		}
	}, [isFetchingActiveLicense, activeLicense]);

	return (
		<div>
			<Modal
				rootClassName="workspace-access-restricted__modal"
				title={
					<div className="workspace-access-restricted__modal__header">
						<span className="workspace-access-restricted__modal__title">
							<ConsoleText message={'Your workspace access is restricted'} />
						</span>
					</div>
				}
				open
				closable={false}
				footer={null}
				width="65%"
			>
				<div className="workspace-access-restricted__container">
					{isFetchingActiveLicense || !activeLicense ? (
						<Skeleton />
					) : (
						<>
							<Row justify="center" align="middle">
								<Col>
									<Space direction="vertical" align="center">
										<Typography.Title
											level={4}
											className="workspace-access-restricted__details"
										>
											{activeLicense.state === LicenseState.TERMINATED && (
												<>
													<ConsoleText
														message={
															'Your SigNoz license is terminated, please contact support at'
														}
													/>{' '}
													<a href="mailto:cloud-support@signoz.io">
														cloud-support@signoz.io
													</a>{' '}
													<ConsoleText message={'for a new deployment'} />
												</>
											)}
											{activeLicense.state === LicenseState.EXPIRED && (
												<>
													<ConsoleText
														message={
															'Your SigNoz license is expired, please contact support at'
														}
													/>{' '}
													<a href="mailto:cloud-support@signoz.io">
														cloud-support@signoz.io
													</a>{' '}
													<ConsoleText
														message={'for renewal to avoid termination of license as per our'}
													/>{' '}
													<a
														href="https://signoz.io/terms-of-service"
														target="_blank"
														rel="noopener noreferrer"
													>
														<ConsoleText message={'terms of service'} />
													</a>
													.
												</>
											)}
											{activeLicense.state === LicenseState.CANCELLED && (
												<>
													<ConsoleText
														message={
															'Your SigNoz license is cancelled, please contact support at'
														}
													/>{' '}
													<a href="mailto:cloud-support@signoz.io">
														cloud-support@signoz.io
													</a>{' '}
													<ConsoleText
														message={
															'for reactivation to avoid termination of license as per our'
														}
													/>{' '}
													<a
														href="https://signoz.io/terms-of-service"
														target="_blank"
														rel="noopener noreferrer"
													>
														<ConsoleText message={'terms of service'} />
													</a>
													.
												</>
											)}
										</Typography.Title>

										<Button
											type="default"
											shape="round"
											size="middle"
											href="mailto:cloud-support@signoz.io"
											role="button"
										>
											<ConsoleText message={'Contact Us'} />
										</Button>
									</Space>
								</Col>
							</Row>
							<div className="workspace-access-restricted__creative">
								<img src={featureGraphicCorrelationUrl} alt="correlation-graphic" />
							</div>
						</>
					)}
				</div>
			</Modal>
		</div>
	);
}

export default WorkspaceAccessRestricted;
