import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const offers = [
  {
    id: 1,
    title: "Summer Collection",
    description: "Get up to 50% off on our latest summer collection",
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    discount: "50% OFF",
    endDate: "2024-08-31",
  },
  {
    id: 2,
    title: "Premium Accessories",
    description: "Buy any 2 accessories and get 1 free",
    image: "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg?auto=compress&cs=tinysrgb&w=800",
    discount: "BUY 2 GET 1",
    endDate: "2024-07-15",
  },
];

const SpecialOffers = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SparklesIcon className="h-6 w-6 text-indigo-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Special Offers
            </h2>
          </div>
          <p className="text-indigo-200/60 max-w-2xl mx-auto">
            Don't miss out on these amazing deals and exclusive offers
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              to={`/offers/${offer.id}`}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm"
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x450/333/FFF?text=Special+Offer';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent">
                  <div className="absolute top-4 right-4">
                    <div className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold animate-pulse">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-indigo-200/80 mb-4">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors duration-300">
                        <span>Shop Now</span>
                        <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      <div className="text-indigo-200/60 text-sm">
                        Ends {new Date(offer.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers; 