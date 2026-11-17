import useConsoleTranslation from 'hooks/useConsoleTranslation';
import ConsoleText from 'components/ConsoleText/ConsoleText';
import { useCallback } from 'react';
import LearnMore from 'components/LearnMore/LearnMore';
import { MCP_USE_CASES_URL } from '../clients';

import './UseCasesCard.styles.scss';

interface UseCasesCardProps {
	onDocsLinkClick: (target: string) => void;
}

function UseCasesCard({ onDocsLinkClick }: UseCasesCardProps): JSX.Element {
	const translate = useConsoleTranslation();
	const handleClick = useCallback(
		() => onDocsLinkClick('use-cases'),
		[onDocsLinkClick],
	);

	return (
		<section className="mcp-use-cases-card">
			<h3 className="mcp-use-cases-card__title">
				<ConsoleText message={'What you can do with it'} />
			</h3>
			<ul className="mcp-use-cases-card__list">
				<li>
					<ConsoleText
						message={'Ask your AI assistant to investigate a spiking error rate.'}
					/>
				</li>
				<li>
					<ConsoleText
						message={'Debug a slow service by walking through recent traces.'}
					/>
				</li>
				<li>
					<ConsoleText
						message={'Summarize an alert and suggest likely root causes.'}
					/>
				</li>
				<li>
					<ConsoleText
						message={
							'Generate dashboards or queries from a natural-language description.'
						}
					/>
				</li>
			</ul>
			<LearnMore
				text={translate('See more use cases')}
				url={MCP_USE_CASES_URL}
				onClick={handleClick}
			/>
		</section>
	);
}

export default UseCasesCard;
