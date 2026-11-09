import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useThemeConfig } from 'hooks/useDarkMode';
import { NotificationProvider } from 'hooks/useNotifications';
import { CmdKProvider } from 'providers/cmdKProvider';
import { ErrorModalProvider } from 'providers/ErrorModalProvider';

import { AppLayer } from './types';

export interface AppShellProps {
	children: ReactNode;
	router: AppLayer;
	/** Mounted beside the routed content: the command palette and its siblings. */
	overlays?: ReactNode;
}

/**
 * The layers between a resolved session and a page. Mounted once the boot
 * fetches settle, above `PrivateRoute`, so it also covers the redirects and the
 * not-found route, and it survives every navigation.
 *
 * A new provider belongs here if it needs the router or the user and has to
 * outlive the page: a global overlay, a shortcut host, anything one route opens
 * and the next one keeps.
 *
 * `ConfigProvider` reads `useThemeConfig`, which needs `ThemeProvider` above it,
 * so the antd theme is settled here instead of by the caller.
 */
function AppShell({ children, router, overlays }: AppShellProps): JSX.Element {
	const themeConfig = useThemeConfig();
	const { i18n } = useTranslation();

	return (
		<ConfigProvider
			theme={themeConfig}
			locale={i18n?.language === 'zh-CN' ? zhCN : undefined}
		>
			{router(
				<CmdKProvider>
					<NotificationProvider>
						<ErrorModalProvider>
							{overlays}
							{children}
						</ErrorModalProvider>
					</NotificationProvider>
				</CmdKProvider>,
			)}
		</ConfigProvider>
	);
}

AppShell.defaultProps = {
	overlays: undefined,
};

export default AppShell;
