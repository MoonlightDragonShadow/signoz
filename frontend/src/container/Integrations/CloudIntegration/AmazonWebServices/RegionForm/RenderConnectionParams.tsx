import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { Input } from '@signozhq/ui/input';
import { Form } from 'antd';
import { CloudintegrationtypesCredentialsDTO } from 'api/generated/services/sigNoz.schemas';

function RenderConnectionFields({
	isConnectionParamsLoading,
	connectionParams,
}: {
	isConnectionParamsLoading?: boolean;
	connectionParams?: CloudintegrationtypesCredentialsDTO | null;
}): JSX.Element | null {
	const translateConsole = useConsoleTranslation();
	if (
		isConnectionParamsLoading ||
		(!!connectionParams?.ingestionUrl &&
			!!connectionParams?.ingestionKey &&
			!!connectionParams?.sigNozApiUrl &&
			!!connectionParams?.sigNozApiKey)
	) {
		return null;
	}

	return (
		<Form.Item name="connectionParams">
			{!connectionParams?.ingestionUrl && (
				<Form.Item
					name="ingestionUrl"
					label={translateConsole('Ingestion URL')}
					rules={[
						{
							required: true,
							message: translateConsole('Please enter ingestion URL'),
						},
					]}
				>
					<Input placeholder={translateConsole('Enter ingestion URL')} />
				</Form.Item>
			)}
			{!connectionParams?.ingestionKey && (
				<Form.Item
					name="ingestionKey"
					label={translateConsole('Ingestion Key')}
					rules={[
						{
							required: true,
							message: translateConsole('Please enter ingestion key'),
						},
					]}
				>
					<Input placeholder={translateConsole('Enter ingestion key')} />
				</Form.Item>
			)}
			{!connectionParams?.sigNozApiUrl && (
				<Form.Item
					name="sigNozApiUrl"
					label={translateConsole('SigNoz API URL')}
					rules={[
						{
							required: true,
							message: translateConsole('Please enter SigNoz API URL'),
						},
					]}
				>
					<Input placeholder={translateConsole('Enter SigNoz API URL')} />
				</Form.Item>
			)}
			{!connectionParams?.sigNozApiKey && (
				<Form.Item
					name="sigNozApiKey"
					label={translateConsole('SigNoz API KEY')}
					rules={[
						{
							required: true,
							message: translateConsole('Please enter SigNoz API Key'),
						},
					]}
				>
					<Input placeholder={translateConsole('Enter SigNoz API Key')} />
				</Form.Item>
			)}
		</Form.Item>
	);
}

RenderConnectionFields.defaultProps = {
	connectionParams: null,
	isConnectionParamsLoading: false,
};

export default RenderConnectionFields;
