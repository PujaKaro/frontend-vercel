import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component for consistent metadata across pages
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description (max 160 characters recommended)
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.imageUrl - Image URL for social sharing (OpenGraph/Twitter)
 * @param {string} props.type - Content type (website, article, product, etc.)
 * @param {Object} props.schema - JSON-LD schema markup
 * @param {Array} props.keywords - Keywords for the page
 */
const SEO = ({ 
  title = "PujaKaro - Your One-Stop Solution for Religious Needs",
  description = "Book authentic pujas, purchase religious items, and connect with experienced pandits. PujaKaro offers traditional puja services, premium quality products, and spiritual guidance.",
  canonicalUrl = "https://pujakaro.com",
  imageUrl = "https://pujakaro.com/images/og-image.jpg",
  type = "website",
  schema = null,
  keywords = "puja, hindu rituals, religious products, pandit, spiritual services, online puja booking",
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(", ") : keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 