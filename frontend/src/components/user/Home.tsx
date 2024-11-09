import Header from './common/Header';
import Footer from './common/Footer';
import { User, Tag, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
  
      <main className="pt-16">
       
        
        
          <div className="relative h-[500px]">
            <img 
              src="/bg.jpeg" 
              alt="Hot air balloons"
              className="w-full h-full object-cover"
            />
          </div>

       
          <div className="bg-grey py-12 shadow-lg">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      
      {/* Handpicked Activities */}
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <User size={32} className="text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Handpicked Activities
        </h3>
        <p className="text-gray-600">
          Explore the best experiences<br />
          in your favourite cities
        </p>
      </div>

      {/* Lowest Prices */}
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Tag size={32} className="text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Lowest Prices
        </h3>
        <p className="text-gray-600">
          Guaranteed lowest prices.<br />
          Anyday, everyday.
        </p>
      </div>

      {/* 100% Secure */}
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <ShieldCheck size={32} className="text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          100% Secure
        </h3>
        <p className="text-gray-600">
          Every transaction is secure.<br />
          Your money is safe
        </p>
      </div>

    </div>
  </div>
</div>

        {/* Domestic Trips Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DOMESTIC TRIPS
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Goa", image: "/bg.jpeg", price: "999" },
              { title: "Manali", image: "/img4.jpeg", price: "1299" },
              { title: "Nepal", image: "/img5.jpeg", price: "1499" },
            ].map((trip, index) => (
              <div key={index} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                  <p className="text-gray-600">Starting from ${trip.price}</p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* International Trips Section */}
        <section className="container mx-auto py-16 px-4 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              INTERNATIONAL TRIPS
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "USA", image: "/img7.jpg", price: "1999" },
              { title: "Europe", image: "/img3.jpeg", price: "2499" },
              { title: "Paris", image: "/background.jpg", price: "2999" },
            ].map((trip, index) => (
              <div key={index} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="relative overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                  <p className="text-gray-600">Starting from ${trip.price}</p>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;