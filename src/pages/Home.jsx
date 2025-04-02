import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import FeaturedPuja from '../components/FeaturedPuja';
import ProductsSection from '../components/ProductsSection';
import PanditSection from '../components/PanditSection';

const Home = () => {
  return (
    <main className="mt-2">
      <HeroSection />
      <Services />
      <FeaturedPuja />
      <ProductsSection />
      <PanditSection />
    </main>
  );
};

export default Home; 