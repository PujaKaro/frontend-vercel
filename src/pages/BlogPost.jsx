import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faClock, faTags, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/blog" className="text-orange-600 hover:text-orange-700">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Split content into paragraphs
  const paragraphs = post.content.split('\n\n').filter(p => p.trim());

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || post.title} | PujaKaro</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.metaKeywords || post.tags.join(', ')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.ogTitle || post.title} />
        <meta property="og:description" content={post.ogDescription || post.excerpt} />
        <meta property="og:image" content={post.ogImage || post.imageUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.ogTitle || post.title} />
        <meta name="twitter:description" content={post.ogDescription || post.excerpt} />
        <meta name="twitter:image" content={post.ogImage || post.imageUrl} />
        
        {/* Canonical URL */}
        {post.canonicalUrl && <link rel="canonical" href={post.canonicalUrl} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Blog
            </Link>

            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-64 md:h-96 object-cover"
              />
              
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
                  <div className="flex items-center mr-6 mb-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex items-center mr-6 mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faTags} className="text-gray-500 mr-2" />
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost; 