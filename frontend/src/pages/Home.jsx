import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[85vh] flex flex-col bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="relative flex-grow flex items-center justify-start overflow-hidden min-h-[400px] lg:min-h-[550px]">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-right lg:bg-center"
            style={{ backgroundImage: "url('/hero-indochinese.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent"></div>
        </div>

        <div className="z-10 w-full max-w-4xl px-8 lg:px-24 xl:px-32 py-12 lg:py-20 flex flex-col items-start text-left">
          <div className="mb-8 flex flex-col items-start">
            <div className="w-16 h-1 bg-red-600 mb-6 rounded-full"></div>
            <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs lg:text-sm mb-4">A Taste of Fusion</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] drop-shadow-lg">
            Authentic <br />
            <span className="text-red-500 italic">Indo-Chinese</span>
          </h1>

          <p className="text-lg lg:text-xl text-stone-300 max-w-xl mb-12 font-light leading-relaxed drop-shadow-md">
            Experience the vibrant crossover of fiery Indian spices and traditional Chinese wok techniques. Expertly crafted Hakka noodles, sizzling Manchurian, and bold Chilli Chicken await you.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              to="/products" 
              className="px-8 py-4 bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-red-600/30 rounded-md text-center"
            >
              Order Online
            </Link>
            <Link 
              to="/products" 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-stone-900 transition-all transform hover:-translate-y-1 rounded-md text-center shadow-lg"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-stone-50 py-24 relative border-t border-stone-200">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4 tracking-wide">The Half Fried <span className="text-red-600 italic">Philosophy</span></h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 text-center">
            {/* Card 1 */}
            <div className="group relative bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-20 h-20 mx-auto bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100 group-hover:border-red-100 group-hover:bg-red-50 transition-colors duration-500">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 tracking-wide">Unapologetically Bold</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">Prepare your palate for a symphony of spices. We celebrate the punchy, garlic-infused heat of authentic street-style Desi Chinese, perfectly balancing fiery chilies with addictive tangy glazes.</p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 lg:translate-y-6 lg:hover:translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-20 h-20 mx-auto bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100 group-hover:border-red-100 group-hover:bg-red-50 transition-colors duration-500">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 tracking-wide">Authentic Wok Hei</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">Experience the "breath of the wok." Our master chefs toss your noodles and rice at blistering temperatures, locking in that signature smoky, charred aroma that defines exceptional stir-fry.</p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-20 h-20 mx-auto bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100 group-hover:border-red-100 group-hover:bg-red-50 transition-colors duration-500">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 tracking-wide">Two Worlds United</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">Our kitchen is where ancient Chinese cooking methods meet the rich, soul-warming spices of the Indian subcontinent, creating a fusion that is comfortably familiar yet explosively exciting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
