import { Card, CardBody } from 'react-bootstrap';
import campaignSvg from '@/assets/images/svg/email-campaign.svg';


const CampaignWidget = () => {
	return (
		<Card className="cta-box bg-primary text-white">
			<CardBody>
				<div className="d-flex align-items-start align-items-center">
					<div className="w-100 overflow-hidden">
						<h2 className="mt-0 text-reset">
							<i className="mdi mdi-bullhorn-outline"></i>
						</h2>
						<h3 className="m-0 fw-normal cta-box-title text-reset">
							Enhance your <b>Campaign</b> for better outreach
							<i className="mdi mdi-arrow-right ms-1"></i>
						</h3>
					</div>
					<img className="ms-3" src={campaignSvg} width="120" alt="Generic placeholder" />
				</div>
			</CardBody>
		</Card>
	);
};

export default CampaignWidget;
