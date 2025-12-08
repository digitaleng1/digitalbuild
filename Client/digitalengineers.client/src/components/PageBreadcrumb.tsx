import { type ReactNode } from 'react';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

type PageTitleProps = {
	title: string;
	subName?: string;
	children?: ReactNode;
};

type PageMetaDataProps = {
	title: string
	description?: string
	keywords?: string
}


const defaultPageMetaData: PageMetaDataProps = {
	title: 'Novobid - Platform',
	description:
		'Novobid - Professional platform for engineers and construction projects management.',
	keywords:
		'Digital Engineers, Novobid, construction, project management, engineers, building, CRM, platform',
}

const PageBreadcrumb = ({ subName, title, children }: PageTitleProps) => {
	return (
		<>
			<title>{title ? `${title} | ${defaultPageMetaData.title}` : defaultPageMetaData.title}</title>
			<meta name="description" content={defaultPageMetaData.description} />
			<meta name="keywords" content={defaultPageMetaData.keywords} />
			{subName && (
				<Row>
					<Col>
						<div className="page-title-box">
							<div className="page-title-right">
								<Breadcrumb listProps={{ className: 'm-0' }}>
									<BreadcrumbItem as={'li'}>Novobid</BreadcrumbItem>
									<BreadcrumbItem as={'li'}>{subName}</BreadcrumbItem>
									<BreadcrumbItem as={'li'} active>
										{title}
									</BreadcrumbItem>
								</Breadcrumb>
							</div>
							<h4 className="page-title">
								{title}
								{children ?? null}
							</h4>
						</div>
					</Col>
				</Row>
			)}
		</>
	);
};

export default PageBreadcrumb;
