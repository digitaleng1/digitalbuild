import { Nav, Navbar, Container } from 'react-bootstrap';
import { useAccountLayout } from '@/components/BGCircles';


const NavBar = () => {
	useAccountLayout();
	
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<Navbar 
			collapseOnSelect 
			expand="lg" 
			className="py-lg-3"
			style={{ 
				backgroundColor: '#ffffff',
				boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
				borderBottom: '1px solid #e8e8e8'
			}}
		>
			<Container>
				<Navbar.Brand 
					href="/" 
					className="me-lg-5"
					style={{
						color: '#3B82F6',
						fontSize: '1.5rem',
						fontWeight: 'bold',
						textDecoration: 'none'
					}}
				>
					Digital Engineers
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler">
					<i className="mdi mdi-menu"></i>
				</Navbar.Toggle>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav as="ul" className="me-auto align-items-center navbar-nav">
						<Nav.Item as="li" className="mx-lg-1">
							<Nav.Link 
								href="#home" 
								onClick={(e) => {
									e.preventDefault();
									window.scrollTo({ top: 0, behavior: 'smooth' });
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								Home
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="mx-lg-1">
							<Nav.Link 
								href="#engineers"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('engineers');
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								Engineers
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="mx-lg-1">
							<Nav.Link 
								href="#projects"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('projects');
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								Projects
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="mx-lg-1">
							<Nav.Link 
								href="#how-it-works"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('how-it-works');
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								How It Works
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="mx-lg-1">
							<Nav.Link 
								href="#faqs"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('faqs');
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								FAQs
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="mx-lg-1">
							<Nav.Link 
								href="#contact"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('contact');
								}}
								style={{ color: '#6B7280', cursor: 'pointer' }}
							>
								Contact
							</Nav.Link>
						</Nav.Item>
					</Nav>

					<ul className="navbar-nav ms-auto align-items-center">
						<li className="nav-item me-2">
							<a 
								href="/account/login" 
								className="nav-link"
								style={{ color: '#6B7280' }}
							>
								Login
							</a>
						</li>
						<li className="nav-item me-0">
							<a
								href="/account/register"
								className="btn btn-sm rounded-pill d-none d-lg-inline-flex"
								style={{
									backgroundColor: '#3B82F6',
									color: '#ffffff',
									border: 'none',
									padding: '0.5rem 1.5rem'
								}}
							>
								<i className="mdi mdi-account-plus me-1" /> Sign Up
							</a>
							<a 
								href="/account/register" 
								className="nav-link d-lg-none"
								style={{ color: '#6B7280' }}
							>
								Sign Up
							</a>
						</li>
					</ul>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;
