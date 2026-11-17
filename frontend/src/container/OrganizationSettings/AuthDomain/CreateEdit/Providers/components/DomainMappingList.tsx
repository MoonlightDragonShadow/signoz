import ConsoleText from 'components/ConsoleText/ConsoleText';
import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Plus, Trash2 } from '@signozhq/icons';
import { Button } from '@signozhq/ui/button';
import { Input } from '@signozhq/ui/input';
import { Form } from 'antd';

import './DomainMappingList.styles.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (_: unknown, value: string): Promise<void> => {
	if (!value) {
		return Promise.reject(new Error('Admin email is required'));
	}
	if (!EMAIL_REGEX.test(value)) {
		return Promise.reject(new Error('Please enter a valid email'));
	}
	return Promise.resolve();
};

interface DomainMappingListProps {
	fieldNamePrefix: string[];
}

function DomainMappingList({
	fieldNamePrefix,
}: DomainMappingListProps): JSX.Element {
	const translateConsole = useConsoleTranslation();
	return (
		<div className="domain-mapping-list">
			<div className="domain-mapping-list__header">
				<span className="domain-mapping-list__title">
					{translateConsole('Domain to Admin Email Mapping')}
				</span>
				<p className="domain-mapping-list__description">
					<ConsoleText
						message={
							'Map workspace domains to admin emails for service account impersonation. Use "*" as a wildcard for any domain.'
						}
					/>
				</p>
			</div>

			<Form.List name={fieldNamePrefix}>
				{(fields, { add, remove }): JSX.Element => (
					<div className="domain-mapping-list__items">
						{fields.map((field) => (
							<div key={field.key} className="domain-mapping-list__row">
								<Form.Item
									name={[field.name, 'domain']}
									className="domain-mapping-list__field"
									rules={[
										{ required: true, message: translateConsole('Domain is required') },
									]}
								>
									<Input
										placeholder={translateConsole('Domain (e.g., example.com or *)')}
									/>
								</Form.Item>

								<Form.Item
									name={[field.name, 'adminEmail']}
									className="domain-mapping-list__field"
									rules={[{ validator: validateEmail }]}
								>
									<Input placeholder={translateConsole('Admin Email')} />
								</Form.Item>

								<Button
									size="md"
									variant="ghost"
									color="secondary"
									onClick={(): void => remove(field.name)}
									aria-label={translateConsole('Remove mapping')}
									icon
								>
									<Trash2 size={12} />
								</Button>
							</div>
						))}

						<Button
							size="md"
							variant="outlined"
							color="secondary"
							onClick={(): void => add({ domain: '', adminEmail: '' })}
							prefix={<Plus size={14} />}
						>
							{translateConsole('Add Domain Mapping')}
						</Button>
					</div>
				)}
			</Form.List>
		</div>
	);
}

export default DomainMappingList;
