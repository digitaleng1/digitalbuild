import {Link} from "react-router";
import {
	Row,
	Col,
	Card,
	CardGroup,
	ListGroup,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	CardLink,
	CardSubtitle,
	CardHeader,
	CardFooter,
	ListGroupItem,
} from 'react-bootstrap';
import classNames from 'classnames';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Portlet from '@/components/Portlet';

import cardImg from '@/assets/images/small/small-1.jpg';
import cardImg2 from '@/assets/images/small/small-4.jpg';
import cardImg3 from '@/assets/images/small/small-2.jpg';
import cardImg4 from '@/assets/images/small/small-3.jpg';




const CardWithImage = () => {
	return (
		<Card className="d-block">
			<CardImg src={cardImg} />
			<CardBody>
				<CardTitle as="h5">Card title</CardTitle>
				<CardText>
					Some quick example text to build on the card title and make up the bulk of the card&apos;s content. Some quick example text to build on the
					card title and make up.
				</CardText>
				<button className="btn btn-primary">Button</button>
			</CardBody>
		</Card>
	);
};

const CardWithImage2 = () => {
	return (
		<Card className="d-block">
			<CardImg src={cardImg3} />
			<CardBody>
				<CardTitle as="h5">Card title</CardTitle>
				<CardText>Some quick example text to build on the card..</CardText>
			</CardBody>

			<ListGroup variant="flush">
				<ListGroupItem>Cras justo odio</ListGroupItem>
			</ListGroup>

			<CardBody>
				<CardLink href="">Card link</CardLink>
				<CardLink href="">Another link</CardLink>
			</CardBody>
		</Card>
	);
};

const CardWithImage3 = () => {
	return (
		<Card className="d-block">
			<CardImg src={cardImg4} />
			<CardBody>
				<CardText>
					Some quick example text to build on the card title and make up the bulk of the card&apos;s content. Some quick example text to build on the
					card title and make up.
				</CardText>
				<button className="btn btn-primary">Button</button>
			</CardBody>
		</Card>
	);
};

const CardWithTitleAndImage = () => {
	return (
		<Card>
			<CardBody className="d-block">
				<CardTitle as="h5">Card title</CardTitle>
				<CardSubtitle as="h6" className="text-muted">
					Support card subtitle
				</CardSubtitle>
			</CardBody>
			<CardImg src={cardImg2} className="img-fluid" />
			<CardBody>
				<CardText>Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</CardText>
				<CardLink href="">Card link</CardLink>
				<CardLink href="">Another link</CardLink>
			</CardBody>
		</Card>
	);
};

const CardWithSpecialTitle = () => {
	return (
		<Card>
			<CardBody>
				<CardTitle as="h5">Special title treatment</CardTitle>
				<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
				<button className="btn btn-primary w-100">Go somewhere</button>
			</CardBody>
		</Card>
	);
};

const CardWithHeader = () => {
	return (
		<Card>
			<CardHeader as="h6">Featured</CardHeader>
			<CardBody>
				<CardTitle as="h5">Special title treatment</CardTitle>
				<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
				<button className="btn btn-primary mt-1">Go somewhere</button>
			</CardBody>
		</Card>
	);
};

const CardWithHeaderAndQuote = () => {
	return (
		<Card>
			<CardHeader>Quote</CardHeader>
			<CardBody>
				<blockquote className="card-bodyquote">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
				</blockquote>
			</CardBody>
			<CardFooter>
				Someone famous in <cite title="Source Title">Source Title</cite>
			</CardFooter>
		</Card>
	);
};

const CardWithHeaderAndFooter = () => {
	return (
		<Card>
			<CardHeader>Featured</CardHeader>
			<CardBody>
				<button className="btn btn-primary mt-1">Go somewhere</button>
			</CardBody>
			<CardFooter>2 days ago</CardFooter>
		</Card>
	);
};

const ColoredCards = () => {
	const colors: string[] = ['secondary', 'primary', 'success', 'info', 'warning', 'danger'];

	return (
		<>
			{colors.map((color, index) => {
				return (
					<Col lg={4} sm={6} key={index.toString()}>
						<Card className={classNames('text-white', 'bg-' + color)}>
							<CardBody>
								<CardTitle as="h5">Special title treatment</CardTitle>
								<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
								<CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</CardText>
							</CardBody>
						</Card>
					</Col>
				);
			})}
		</>
	);
};

const BorderdCards = () => {
	const colors: string[] = ['secondary', 'primary', 'success'];

	return (
		<>
			{colors.map((color, index) => {
				return (
					<Col md={4} key={index.toString()}>
						<Card className={classNames('border', [`border-${color}`])}>
							<CardBody>
								<CardTitle as="h5">Special title treatment</CardTitle>
								<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
								<button className={classNames('btn', 'btn-sm', [`btn-${color}`])}>Button</button>
							</CardBody>
						</Card>
					</Col>
				);
			})}
		</>
	);
};

const HorizontalCards = () => {
	return (
		<Card>
			<Row className="g-0 align-items-center">
				<Col md={4}>
					<CardImg src={cardImg2} className="img-fluid" />
				</Col>

				<Col md={8}>
					<CardBody>
						<CardTitle as="h5">Card Title</CardTitle>
						<CardText>
							This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
						</CardText>
						<CardText>
							<small className="text-muted">Last updated 3 mins ago</small>
						</CardText>
					</CardBody>
				</Col>
			</Row>
		</Card>
	);
};

const StretchedLinks = () => {
	const colors: string[] = ['primary', 'info'];
	return (
		<>
			{colors.map((color, index) => {
				return (
					<Col key={index.toString()} sm={6} lg={3}>
						<Card>
							<CardImg src={cardImg} />
							<CardBody>
								<CardTitle as="h5">Card with stretched link</CardTitle>
								<button className={classNames('btn', 'stretched-link', 'mt-2', [`btn-${color}`])}>Go somewhere</button>
							</CardBody>
						</Card>
					</Col>
				);
			})}
			{colors.map((color, index) => {
				return (
					<Col key={index.toString()} sm={6} lg={3}>
						<Card>
							<CardImg src={cardImg} />
							<CardBody>
								<CardTitle as="h5">
									<Link to="" className={classNames('stretched-link', [`text-${color}`])}>
										Card with stretched link
									</Link>
								</CardTitle>
								<CardText>Some quick example text to build on the card up the bulk of the card&apos;s content.</CardText>
							</CardBody>
						</Card>
					</Col>
				);
			})}
		</>
	);
};

const CardsGroup = () => {
	return (
		<CardGroup>
			<CardWithImage2 />
			<CardWithImage2 />
			<CardWithImage2 />
		</CardGroup>
	);
};

const CardsDeck = () => {
	return (
		<Row className="row-cols-1 row-cols-md-3 g-3">
			<Col>
				<CardWithImage2 />
			</Col>
			<Col>
				<CardWithImage2 />
			</Col>
			<Col>
				<CardWithImage2 />
			</Col>
		</Row>
	);
};

const CardsUI = () => {
	return (
		<>
			<PageBreadcrumb title="Cards" subName="Base UI" />

			<Row>
				<Col sm={6} lg={3}>
					<CardWithImage />
				</Col>

				<Col sm={6} lg={3}>
					<CardWithImage2 />
				</Col>

				<Col sm={6} lg={3}>
					<CardWithImage3 />
				</Col>

				<Col sm={6} lg={3}>
					<CardWithTitleAndImage />
				</Col>
			</Row>

			<Row>
				<Col sm={6}>
					<CardWithSpecialTitle />
				</Col>
				<Col sm={6}>
					<CardWithSpecialTitle />
				</Col>
			</Row>

			<Row>
				<Col md={4}>
					<CardWithHeader />
				</Col>

				<Col md={4}>
					<CardWithHeaderAndQuote />
				</Col>

				<Col md={4}>
					<CardWithHeaderAndFooter />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4">Card Colored</h4>
				</Col>
			</Row>

			<Row>
				<ColoredCards />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4">Card Bordered</h4>
				</Col>
			</Row>

			<Row>
				<BorderdCards />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4">Horizontal Card</h4>
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<HorizontalCards />
				</Col>
				<Col lg={6}>
					<HorizontalCards />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mt-4 mb-4">Stretched link</h4>
				</Col>
			</Row>

			<Row>
				<StretchedLinks />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4">Card Group</h4>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<CardsGroup />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4 mt-4">Card Decks</h4>
				</Col>
				<Col xs={12}>
					<CardsDeck />
				</Col>
			</Row>

			<Row>
				<Col>
					<h4 className="mb-4 mt-4">Custom Card Portlets</h4>
				</Col>
			</Row>
			<Row>
				<Col md={4}>
					<Portlet className="mb-md-0 mb-3">
						<p>
							Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
							skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
							single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
							ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
							probably haven&apos;t heard of them accusamus labore sustainable VHS.
						</p>
					</Portlet>
				</Col>

				<Col md={4}>
					<Portlet className="bg-primary text-white mb-md-0 mb-3">
						<p>
							Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
							skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
							single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
							ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
							probably haven&apos;t heard of them accusamus labore sustainable VHS.
						</p>
					</Portlet>
				</Col>

				<Col md={4}>
					<Portlet className="bg-success text-white mb-0">
						<p>
							Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
							skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
							single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
							ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
							probably haven&apos;t heard of them accusamus labore sustainable VHS.
						</p>
					</Portlet>
				</Col>
			</Row>
		</>
	);
};

export default CardsUI;
