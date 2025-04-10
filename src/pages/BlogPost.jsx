import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getDoc, doc, query, where, limit, getDocs } from 'firebase/firestore';
import { blogsCollection, db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Get blog by slug
        const blogQuery = query(blogsCollection, where('slug', '==', slug));
        const blogSnapshot = await getDocs(blogQuery);
        
        if (blogSnapshot.empty) {
          setError('Blog post not found');
          return;
        }

        const blogData = {
          id: blogSnapshot.docs[0].id,
          ...blogSnapshot.docs[0].data()
        };
        setBlog(blogData);

        // Fetch related posts from the same category
        const relatedQuery = query(
          blogsCollection,
          where('categories', 'array-contains-any', blogData.categories),
          where('slug', '!=', slug),
          limit(3)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedData = relatedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRelatedPosts(relatedData);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{blog.title} - Puja Services Blog</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src={blog.author.image}
                  alt={blog.author.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center">
                <span>{new Date(blog.publishedAt.toDate()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Categories */}
          <div className="flex items-center space-x-2 mb-8">
            {blog.categories.map(category => (
              <span
                key={category}
                className="inline-block px-3 py-1 text-sm font-medium bg-orange-100 text-orange-600 rounded-full"
              >
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {category}
              </span>
            ))}
          </div>

          {/* Blog Content */}
          <div className="prose prose-orange max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost; 