import ConsoleText from 'components/ConsoleText/ConsoleText';
import { EQueryType } from 'types/common/dashboard';

function QueryTypeTag({ queryType }: IQueryTypeTagProps): JSX.Element {
	switch (queryType) {
		case EQueryType.QUERY_BUILDER:
			return (
				<span>
					<ConsoleText message={'Query Builder'} />
				</span>
			);

		case EQueryType.CLICKHOUSE:
			return (
				<span>
					<ConsoleText message={'ClickHouse Query'} />
				</span>
			);
		case EQueryType.PROM:
			return <span>PromQL</span>;
		default:
			return <span />;
	}
}

interface IQueryTypeTagProps {
	queryType?: EQueryType;
}

QueryTypeTag.defaultProps = {
	queryType: EQueryType.QUERY_BUILDER,
};

export default QueryTypeTag;
