import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { CircleHelp } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@signozhq/ui/popover';
import { Typography } from '@signozhq/ui/typography';

import { MARKDOWN_HELP_ITEMS } from './constants';

import styles from './MarkdownEditor.module.scss';

function MarkdownHelp(): JSX.Element {
	const translateInterfaceCopy = useConsoleTranslation();
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					color="secondary"
					size="sm"
					icon
					aria-label={translateInterfaceCopy('Markdown syntax help')}
					testId="markdown-help-trigger"
				>
					<CircleHelp size={14} />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className={styles.helpContent}>
				<Typography.Text className={styles.helpTitle}>
					<ConsoleText message={'Markdown syntax'} />
				</Typography.Text>
				<dl className={styles.helpList}>
					{MARKDOWN_HELP_ITEMS.map((item) => (
						<div key={item.syntax} className={styles.helpRow}>
							<dt>
								<code>{item.syntax}</code>
							</dt>
							<dd>{translateInterfaceCopy(item.label)}</dd>
						</div>
					))}
				</dl>
			</PopoverContent>
		</Popover>
	);
}

export default MarkdownHelp;
