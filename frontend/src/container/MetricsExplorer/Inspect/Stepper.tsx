import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Color } from '@signozhq/design-tokens';
import { Button } from 'antd';
import { Typography } from '@signozhq/ui/typography';
import classNames from 'classnames';
import { RefreshCcw, SquareArrowOutUpRight } from '@signozhq/icons';

import { SPACE_AGGREGATION_LINK, TEMPORAL_AGGREGATION_LINK } from './constants';
import { InspectionStep, StepperProps } from './types';

import '../../Home/HomeChecklist/HomeChecklist.styles.scss';

function Stepper({
	inspectionStep,
	resetInspection,
}: StepperProps): JSX.Element {
	const translate = useConsoleTranslation();
	return (
		<div className="home-checklist-container">
			<div className="home-checklist-title">
				<Typography.Text>
					{translate('👋 Hello, welcome to the Metrics Inspector')}
				</Typography.Text>
				<Typography.Text>{translate('Let’s get you started...')}</Typography.Text>
			</div>
			<div className="completed-checklist-container whats-next-checklist-container">
				<div
					className={classNames({
						'completed-checklist-item':
							inspectionStep > InspectionStep.TIME_AGGREGATION,
						'whats-next-checklist-item':
							inspectionStep <= InspectionStep.TIME_AGGREGATION,
					})}
				>
					<div
						className={classNames({
							'completed-checklist-item-title':
								inspectionStep > InspectionStep.TIME_AGGREGATION,
							'whats-next-checklist-item-title':
								inspectionStep <= InspectionStep.TIME_AGGREGATION,
						})}
					>
						<ConsoleText message={'First, align the data by selecting a'} />{' '}
						<Typography.Link href={TEMPORAL_AGGREGATION_LINK} target="_blank">
							{translate('Temporal Aggregation')}{' '}
							<SquareArrowOutUpRight color={Color.BG_ROBIN_500} size={10} />
						</Typography.Link>
					</div>
				</div>

				<div
					className={classNames({
						'completed-checklist-item':
							inspectionStep > InspectionStep.SPACE_AGGREGATION,
						'whats-next-checklist-item':
							inspectionStep <= InspectionStep.SPACE_AGGREGATION,
					})}
				>
					<div
						className={classNames({
							'completed-checklist-item-title':
								inspectionStep > InspectionStep.SPACE_AGGREGATION,
							'whats-next-checklist-item-title':
								inspectionStep <= InspectionStep.SPACE_AGGREGATION,
						})}
					>
						<ConsoleText message={'Add a'} />{' '}
						<Typography.Link href={SPACE_AGGREGATION_LINK} target="_blank">
							{translate('Spatial Aggregation')}{' '}
							<SquareArrowOutUpRight color={Color.BG_ROBIN_500} size={10} />
						</Typography.Link>
					</div>
				</div>
			</div>

			<div className="completed-message-container">
				{inspectionStep === InspectionStep.COMPLETED && (
					<>
						<Typography.Text>
							{translate('🎉 Ta-da! You have completed your metric query tutorial.')}
						</Typography.Text>
						<Typography.Text>
							{translate('You can inspect a new metric or reset the query builder.')}
						</Typography.Text>
						<Button icon={<RefreshCcw size={12} />} onClick={resetInspection}>
							{translate('Reset query')}
						</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default Stepper;
