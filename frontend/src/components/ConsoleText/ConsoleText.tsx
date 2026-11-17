import useConsoleTranslation from 'hooks/useConsoleTranslation';

export default function ConsoleText({
	message,
}: {
	message: string;
}): JSX.Element {
	const translate = useConsoleTranslation();
	return <>{translate(message)}</>;
}
