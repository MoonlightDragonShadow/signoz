import { Button, Card, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

import { SEARCH_PLACEHOLDER } from '../Columns/ColumnContants';
import { Search } from '@signozhq/icons';

export const filterDropdown = (
	{ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps,
	translate: (message: string) => string = (message) => message,
): JSX.Element => {
	const handleSearch = (): void => {
		confirm();
	};

	const selectedKeysHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setSelectedKeys(e.target.value ? [e.target.value] : []);
	};

	return (
		<Card size="small">
			<Space align="start" direction="vertical">
				<Input
					placeholder={translate(SEARCH_PLACEHOLDER)}
					value={selectedKeys[0]}
					onChange={selectedKeysHandler}
					allowClear
					onPressEnter={handleSearch}
				/>
				<Button
					type="primary"
					onClick={handleSearch}
					icon={<Search size="md" />}
					size="small"
				>
					{translate('Search')}
				</Button>
			</Space>
		</Card>
	);
};
