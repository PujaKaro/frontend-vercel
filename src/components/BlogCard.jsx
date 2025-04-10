import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faTag } from '@fortawesome/free-solid-svg-icons';

const BlogCard = ({ blog, featured = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${featured ? 'col-span-2 md:flex' : ''}`}>
      <div className={`relative ${featured ? 'md:w-1/2' : ''}`}>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        {blog.categories?.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
              {blog.categories[0]}
            </span>
          </div>
        )}
      </div>
      <div className={`p-6 ${featured ? 'md:w-1/2' : ''}`}>
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors mb-2">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <span>{blog.readTime} min read</span>
          </div>
        </div>
        {blog.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard; 