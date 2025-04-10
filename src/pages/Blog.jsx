import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBlogs = async () => {
      try {
        // Simulated API response
        const response = await new Promise(resolve => setTimeout(() => resolve({
          data: [
            {
              id: 1,
              title: "Top 10 Travel Destinations for 2024",
              slug: "top-10-travel-destinations-2024",
              excerpt: "Discover the most exciting and trending travel destinations that should be on your bucket list for 2024.",
              coverImage: "https://source.unsplash.com/random/800x600/?travel",
              author: "Jane Doe",
              readTime: 5,
              categories: ["Travel"],
              tags: ["destinations", "2024", "bucket-list"],
              featured: true
            },
            // Add more mock blog posts here
          ]
        }), 1000));
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = ['all', ...new Set(blogs.flatMap(blog => blog.categories))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO
        title="Blog - Travel Stories and Tips"
        description="Explore our collection of travel stories, tips, and guides to inspire your next adventure."
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Travel Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover inspiring travel stories, expert tips, and comprehensive guides to help you plan your next adventure.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                featured={blog.featured}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog; 