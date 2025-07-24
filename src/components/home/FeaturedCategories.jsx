import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getFeaturedCategories } from '../../services/categoryService';

const FeaturedCategories = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeaturedCategories = async () => {
			try {
				setLoading(true);
				const response = await getFeaturedCategories();

				if (response.data && response.data.categories && response.data.categories.length > 0) {
					setCategories(response.data.categories);
				} else {
					setCategories([]);
				}
			} catch (error) {
				console.error('Error fetching featured categories:', error);
				setError(error.message);
				setCategories([]);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedCategories();
	}, []);

	if (loading) {
		return (
			<section className="relative py-16 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Featured Categories
						</h2>
						<p className="text-indigo-200/60 max-w-2xl mx-auto">
							Loading our curated collection...
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[...Array(4)].map((_, index) => (
							<div key={index} className="aspect-[4/5] bg-gray-800/50 rounded-2xl animate-pulse"></div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative py-16 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Featured Categories
					</h2>
					<p className="text-indigo-200/60 max-w-2xl mx-auto">
						Explore our curated collection of fashion categories, each offering a unique style statement
					</p>
					{error && (
						<p className="text-red-400 text-sm mt-2">
							Using default categories due to connection issues
						</p>
					)}
				</div>

				{/* Categories Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category) => (
						<Link
							key={category._id || category.id}
							to={`/categories/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
							className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2"
						>
							<div className="aspect-[4/5] relative">
								<img
									src={category.image}
									alt={category.name}
									className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = 'https://placehold.co/400x500/333/FFF?text=Category';
									}}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent">
									<div className="absolute bottom-0 left-0 right-0 p-6">
										<h3 className="text-xl font-semibold text-white mb-2">
											{category.name}
										</h3>
										<p className="text-indigo-200/80 text-sm mb-4">
											{category.productCount} Products
										</p>
										<div className="flex items-center text-indigo-400 text-sm font-medium">
											<span>Explore Category</span>
											<ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
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

export default FeaturedCategories;