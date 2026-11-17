import useConsoleTranslation from 'hooks/useConsoleTranslation';
function Header(): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<div className="traces-funnels-header">
			<div className="traces-funnels-header-title">
				{translateConsole('Funnels')}
			</div>
			<div className="traces-funnels-header-subtitle">
				{translateConsole('Create and manage tracing funnels.')}
			</div>
		</div>
	);
}

export default Header;
