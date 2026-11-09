import AuthPageContainer from 'components/AuthPageContainer';
import LanguageSelector from 'components/LanguageSelector/LanguageSelector';
import LoginContainer from 'container/Login';

import './Login.styles.scss';

function Login(): JSX.Element {
	return (
		<AuthPageContainer>
			<div className="auth-form-card">
				<LanguageSelector />
				<LoginContainer />
			</div>
		</AuthPageContainer>
	);
}

export default Login;
