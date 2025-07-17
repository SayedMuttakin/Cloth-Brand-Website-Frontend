import React from 'react';
import { UserGroupIcon, BuildingOffice2Icon, SparklesIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-indigo-400" />,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else, ensuring a seamless shopping experience."
    },
    {
      icon: <BuildingOffice2Icon className="h-8 w-8 text-indigo-400" />,
      title: "Quality Assurance",
      description: "Every product in our collection undergoes strict quality checks to meet our high standards."
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-indigo-400" />,
      title: "Innovation",
      description: "We continuously evolve and adapt to bring you the latest trends and technology in fashion."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products" },
    { number: "15+", label: "Years Experience" },
    { number: "100+", label: "Brand Partners" }
  ];

  return (
    <div className=" mt-8 relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Our Story
          </h1>
          <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">
            We're passionate about bringing you the finest fashion and accessories,
            curated with care and delivered with excellence.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-indigo-200/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-indigo-200/60">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-indigo-200/60 max-w-3xl mx-auto">
            To revolutionize the online shopping experience by providing high-quality fashion
            products, exceptional customer service, and a seamless digital platform that makes
            finding your perfect style effortless and enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 