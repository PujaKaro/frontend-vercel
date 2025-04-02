const HeroSection = () => {
  return (
    <section className="relative h-[600px]">
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      <div className="relative max-w-8xl mx-auto px-4 h-full flex items-center">
      <img 
        src="/images/heroBanner.jpg" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
        alt="Hero Banner" 
      />
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-6">
            Connect with Divine <br />through PujaKaro
          </h1>
          <p className="text-xl mb-8">
            Your trusted platform for authentic puja services,<br /> 
            religious products, and spiritual guidance
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-custom text-white font-semibold rounded-button hover:bg-custom/90">
              Book a Puja
            </button>
            <button className="px-8 py-3 bg-[#317bea] text-white font-semibold rounded-button hover:bg-[#317bea]/90">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 