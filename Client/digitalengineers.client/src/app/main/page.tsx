import NavBar from './NavBar';
import Hero from './Hero';
import CategoryCarousel from './CategoryCarousel';
import FeaturedProjects from './FeaturedProjects';
import TopEngineers from './TopEngineers';
import HowItWorks from './HowItWorks';
import UserFeedbacks from './UserFeedbacks';
import FAQ from './FAQ';
import ContactUs from './ContactUs';
import Footer from './Footer';
import { rawFaqs } from './data';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const MainPage = () => {
	return (
		<>
			<PageBreadcrumb title="Landing" />
			{/* navbar */}
			<NavBar />

			{/* hero */}
			<Hero />

			{/* category carousel */}
			<CategoryCarousel />

			{/* featured projects */}
			<FeaturedProjects />

			{/* top engineers */}
			<TopEngineers />

			{/* how it works */}
			<HowItWorks />

			{/* user feedbacks */}
			<UserFeedbacks />

			{/* faqs */}
			<FAQ rawFaqs={rawFaqs} />

			{/* contact */}
			<ContactUs />

			{/* footer */}
			<Footer />
		</>
	);
};

export default MainPage;
