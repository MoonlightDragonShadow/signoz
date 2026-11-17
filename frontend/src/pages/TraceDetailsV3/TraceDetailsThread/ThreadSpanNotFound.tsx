import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Button } from '@signozhq/ui/button';
import { ArrowLeft, MessagesSquare, SearchX } from '@signozhq/icons';

import styles from './ThreadSpanNotFound.module.scss';

interface ThreadSpanNotFoundProps {
	onGoBack: () => void;
	onShowThread: () => void;
}

function ThreadSpanNotFound({
	onGoBack,
	onShowThread,
}: ThreadSpanNotFoundProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<div className={styles.root} data-testid="thread-span-not-found">
			<span className={styles.icon}>
				<SearchX size={32} />
			</span>
			<span className={styles.title}>
				{translateConsole('Span not found in this thread')}
			</span>
			<span className={styles.description}>
				<ConsoleText
					message={"The requested span isn't part of this trace's AI thread."}
				/>
			</span>
			<div className={styles.actions}>
				<Button
					variant="outlined"
					color="secondary"
					size="md"
					prefix={<ArrowLeft size={14} />}
					onClick={onGoBack}
					testId="thread-span-not-found-go-back"
				>
					{translateConsole('Go back')}
				</Button>
				<Button
					variant="solid"
					color="primary"
					size="md"
					prefix={<MessagesSquare size={14} />}
					onClick={onShowThread}
					testId="thread-span-not-found-show-thread"
				>
					{translateConsole('Show thread')}
				</Button>
			</div>
		</div>
	);
}

export default ThreadSpanNotFound;
