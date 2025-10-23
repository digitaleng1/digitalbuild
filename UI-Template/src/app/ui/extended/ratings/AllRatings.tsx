
import {Row, Col, Card, CardBody, Button} from 'react-bootstrap';
import { Rating, RoundedStar, Star, StickerStar, ThinRoundedStar, ThinStar } from '@smastrom/react-rating'
import {useState} from "react";

//css
import '@smastrom/react-rating/style.css'

const AllRatings = () => {
	const [rating, setRating] = useState(3)
	const [highlightRating, setHighlightRating] = useState(3)
	const [resetRating, setResetRating] = useState(3)
	const [ratingStyle, setRatingStyle] = useState(3)
	const includedShapesStyles = [Star, ThinStar, RoundedStar, ThinRoundedStar, StickerStar].map((itemShapes) => ({
		itemShapes,
		activeFillColor: '#f59e0b',
		inactiveFillColor: '#ffedd5',
	}))
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Default Rating</h4>
							<p className="text-muted font-14"></p>

							<Rating value={rating} onChange={setRating} style={{ maxWidth: 160 }} />
						</CardBody>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Readonly Rating</h4>

							<Rating value={2} readOnly style={{ maxWidth: 160 }} />
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Disabled Rating</h4>

							<Rating value={0} isDisabled style={{ maxWidth: '160px' }} />
						</CardBody>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Highlight only selected</h4>

							<Rating value={highlightRating} onChange={setHighlightRating} highlightOnlySelected style={{ maxWidth: '160px' }} />
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Rating With Reset Button</h4>

							<div className="d-inline-flex align-items-center gap-3">
								<Rating value={resetRating} onChange={setResetRating} style={{ maxWidth: '160px' }} />
								<Button variant="light" size="sm" onClick={() => setResetRating(0)}>
									Reset
								</Button>
							</div>
						</CardBody>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Rating Styles</h4>
							{includedShapesStyles.map((itemStyles, idx) => (
								<Rating key={`shape_${idx}`} value={ratingStyle} onChange={setRatingStyle} itemStyles={itemStyles} style={{ maxWidth: '160px' }} />
							))}
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllRatings;
