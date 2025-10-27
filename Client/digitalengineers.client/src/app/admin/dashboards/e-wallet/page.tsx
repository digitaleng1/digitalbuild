import PageBreadcrumb from '@/components/PageBreadcrumb';

import { Col, Row } from 'react-bootstrap';
import BalanceStatus from './BalanceStatus';
import MerchantList from './MerchantList';
import MoneyHistory from './MoneyHistory';
import Statistics from './Statistics';
import TransactionList from './TransactionList';
import WalletCard from './WalletCard';
import WatchList from './WatchList';
import { merchantList, moneyHistory, transactionList, watchList } from './data';



const EWalletDashboard = () => {
	return (
		<>
			<PageBreadcrumb title="E Wallet" subName="Dashboard" />

			<Row>
				<Col xxl={9}>
					<Statistics />
					<Row>
						<Col xs={12}>
							<BalanceStatus />
						</Col>
					</Row>
				</Col>
				<Col xxl={3}>
					<Row>
						<Col xxl={12} md={6}>
							<WalletCard />
						</Col>
						<Col xxl={12} md={6}>
							<WatchList watchList={watchList} />
						</Col>
					</Row>
				</Col>
			</Row>

			<Row>
				<Col xxl={3} md={6}>
					<MoneyHistory moneyHistory={moneyHistory} />
				</Col>
				<Col xxl={3} md={6}>
					<MerchantList merchantList={merchantList} />
				</Col>
				<Col xxl={6}>
					<TransactionList transactionList={transactionList} />
				</Col>
			</Row>
		</>
	);
};

export default EWalletDashboard;
