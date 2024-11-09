export const Home = () => {
  const reviews = [
    {
      name: "John Doe",
      rating: 4.5,
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde sunt fugiat dolore ipsum id est maxime ad tempore quasi tenetur.",
      image: "/api/placeholder/48/48"
    },
    {
      name: "John Doe",
      rating: 4,
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde sunt fugiat dolore ipsum id est maxime ad tempore quasi tenetur.",
      image: "/api/placeholder/48/48"
    },
    {
      name: "John Doe",
      rating: 5,
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde sunt fugiat dolore ipsum id est maxime ad tempore quasi tenetur.",
      image: "/api/placeholder/48/48"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] bg-cover bg-center" 
          style={{ backgroundImage: 'url("/img7.jpg")' }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Let's Travel</h1>
              <p className="text-xl md:text-2xl mb-8">Discovering New Horizons</p>
              <button className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-full">
                Explore Now
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ABOUT AVL TRAVELLS
                </span>
              </h2>
              <p className="text-gray-600">
                We're here to create life-changing travel moments, helping adventurous souls explore 
                the world's most breathtaking destinations. Let us guide you through unforgettable journeys.
              </p>
              <button className="mt-8 bg-primary-600 text-white px-6 py-2 rounded-full">
                Show Profile
              </button>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CLIENT REVIEW
              </span>
            </h2>
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4 min-w-full">
                {reviews.map((review, index) => (
                  <div key={index} className="min-w-[280px] bg-white rounded-lg shadow-md p-6">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 text-sm text-center mb-4">
                      {review.text}
                    </p>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800 mb-1">{review.name}</h4>
                      <div className="flex justify-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(review.rating) ? "★" : i < review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;