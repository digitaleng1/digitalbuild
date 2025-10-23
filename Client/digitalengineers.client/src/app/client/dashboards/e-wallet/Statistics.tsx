

import { Col, Row } from 'react-bootstrap';
import StatisticsWidget from './StatisticsWidget';

const Statistics = () => {
	return (
		<Row>
			<Col xl={4}>
				<StatisticsWidget
					icon="mdi mdi-currency-btc"
					stats="$12,500"
					trend="45%"
					currencyType="BTC"
					currencyAmount="$48,781.20"
					chartType="line"
					colors={['#727cf5']}
					data={[25, 33, 28, 35, 30, 40]}
					strokeWidth={2}
				/>
			</Col>
			<Col xl={4}>
				<StatisticsWidget
					icon="mdi mdi-currency-cny"
					stats="$9,250"
					trend="32%"
					currencyType="CNY"
					currencyAmount="$0.6"
					chartType="bar"
					colors={['#727cf5']}
					data={[25, 44, 12, 36, 9, 54, 25, 66, 41, 89, 63]}
					strokeWidth={0}
				/>
			</Col>
			<Col xl={4}>
				<StatisticsWidget
					icon="mdi mdi-currency-eth"
					stats="$12,500"
					trend="60%"
					currencyType="ETH"
					currencyAmount="$3,783.68"
					chartType="line"
					colors={['#727cf5']}
					data={[25, 33, 28, 35, 30, 40]}
					strokeWidth={2}
				/>
			</Col>
		</Row>
	);
};

export default Statistics;
