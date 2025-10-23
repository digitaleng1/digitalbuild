import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router';

interface Category {
	name: string;
	icon: string;
}

const CategoryCarousel = () => {
	const allCategories: Category[] = [
		{ name: 'Agricultural and Biological Engineering', icon: '🌾' },
		{ name: 'Architectural Engineering', icon: '🏛️' },
		{ name: 'Chemical Engineering', icon: '🧪' },
		{ name: 'Civil Engineering', icon: '🏗️' },
		{ name: 'Control Systems Engineering', icon: '🎛️' },
		{ name: 'Electrical and Computer Engineering', icon: '⚡' },
		{ name: 'Environmental Engineering', icon: '🌱' },
		{ name: 'Fire Protection Engineering', icon: '🔥' },
		{ name: 'Industrial and Systems Engineering', icon: '🏭' },
		{ name: 'Mechanical Engineering', icon: '⚙️' },
		{ name: 'Metallurgical and Materials Engineering', icon: '🔬' },
		{ name: 'Mining and Mineral Processing Engineering', icon: '⛏️' },
		{ name: 'Naval Architecture and Marine Engineering', icon: '🚢' },
		{ name: 'Nuclear Engineering', icon: '⚛️' },
		{ name: 'Petroleum Engineering', icon: '🛢️' }
	];

	const categoriesPerPage = 6;
	const totalPages = Math.ceil(allCategories.length / categoriesPerPage);
	const [currentPage, setCurrentPage] = useState(0);

	const getCurrentCategories = () => {
		const start = currentPage * categoriesPerPage;
		const end = start + categoriesPerPage;
		return allCategories.slice(start, end);
	};

	const handlePrevious = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<section className="py-5" style={{  }}>
			<Container>
				<Row className="mb-5">
					<Col lg={12}>
						<div className="text-center">
							<h2 className="mb-3" style={{ fontWeight: '600', color: '#1F2937' }}>
								Browse by Category
							</h2>
							<p className="text-muted" style={{ fontSize: '1.1rem' }}>
								Explore professionals by engineering discipline or project type
							</p>
						</div>
					</Col>
				</Row>

				<div className="position-relative">
					{/* Previous Button */}
					<button
						onClick={handlePrevious}
						disabled={currentPage === 0}
						className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle"
						style={{
							width: '48px',
							height: '48px',
							zIndex: 10,
							left: '-24px',
							border: '1px solid #E5E7EB',
							opacity: currentPage === 0 ? 0.5 : 1,
							cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
						}}
					>
						<i className="mdi mdi-chevron-left" style={{ fontSize: '1.5rem' }}></i>
					</button>

					{/* Categories Grid */}
					<Row className="g-4">
						{getCurrentCategories().map((category, index) => (
							<Col lg={2} md={4} sm={6} key={index}>
								<Link 
									to={`/professionals?category=${encodeURIComponent(category.name)}`}
									style={{ textDecoration: 'none' }}
								>
									<Card
										className="text-center h-100"
										style={{
											border: '1px solid #E5E7EB',
											borderRadius: '12px',
											transition: 'all 0.3s ease',
											cursor: 'pointer',
											backgroundColor: 'white'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
											e.currentTarget.style.transform = 'translateY(-4px)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.boxShadow = 'none';
											e.currentTarget.style.transform = 'translateY(0)';
										}}
									>
										<Card.Body className="p-4">
											<div
												style={{
													fontSize: '3rem',
													marginBottom: '1rem'
												}}
											>
												{category.icon}
											</div>
											<h6
												style={{
													fontSize: '0.9rem',
													color: '#374151',
													fontWeight: '500',
													lineHeight: '1.4',
													minHeight: '40px'
												}}
											>
												{category.name}
											</h6>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						))}
					</Row>

					{/* Next Button */}
					<button
						onClick={handleNext}
						disabled={currentPage === totalPages - 1}
						className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle"
						style={{
							width: '48px',
							height: '48px',
							zIndex: 10,
							right: '-24px',
							border: '1px solid #E5E7EB',
							opacity: currentPage === totalPages - 1 ? 0.5 : 1,
							cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
						}}
					>
						<i className="mdi mdi-chevron-right" style={{ fontSize: '1.5rem' }}></i>
					</button>
				</div>

				{/* Pagination Dots */}
				<Row className="mt-4">
					<Col lg={12}>
						<div className="d-flex justify-content-center align-items-center gap-2">
							{Array.from({ length: totalPages }).map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentPage(index)}
									style={{
										width: index === currentPage ? '24px' : '8px',
										height: '8px',
										borderRadius: '4px',
										border: 'none',
										backgroundColor: index === currentPage ? '#3B82F6' : '#D1D5DB',
										transition: 'all 0.3s ease',
										cursor: 'pointer'
									}}
								/>
							))}
						</div>
						<div className="text-center mt-3">
							<p className="text-muted" style={{ fontSize: '0.9rem' }}>
								Showing {currentPage * categoriesPerPage + 1} - {Math.min((currentPage + 1) * categoriesPerPage, allCategories.length)} of {allCategories.length} professional disciplines
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default CategoryCarousel;
