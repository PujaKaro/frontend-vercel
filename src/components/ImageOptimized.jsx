import React, { useState, useEffect } from 'react';

/**
 * A component for displaying optimized images with lazy loading and progressive loading
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility and SEO
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.width - Image width (in px or %)
 * @param {string} props.height - Image height (in px or %)
 * @param {string} props.objectFit - CSS object-fit property (cover, contain, etc.)
 * @param {boolean} props.lazy - Whether to lazy load the image (default: true)
 * @param {string} props.loadingPriority - 'lazy', 'eager', or 'auto' (default: 'lazy')
 * @param {string} props.placeholderColor - Background color while loading (default: '#f3f4f6')
 * @param {function} props.onLoad - Callback function when image loads
 * @param {function} props.onError - Callback function when image fails to load
 */
const ImageOptimized = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  lazy = true,
  loadingPriority = 'lazy',
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Handle image loading
  const handleImageLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  // Handle image loading error
  const handleImageError = (e) => {
    setError(true);
    if (onError) onError(e);
  };

  // Determine proper component styles
  const containerStyle = {
    backgroundColor: placeholderColor,
    width: width || '100%',
    height: height || '100%',
    position: 'relative',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  // Create structured data for the image (if applicable)
  useEffect(() => {
    // If this is a main product image, we might want to add structured data
    if (rest.isMainImage && rest.productData) {
      const { productData } = rest;
      const imageObject = {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": src,
        "description": alt,
        "representativeOfPage": rest.isMainImage
      };

      // Add schema.org data to the page
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(imageObject);
      document.head.appendChild(script);

      // Cleanup on component unmount
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [src, alt, rest.isMainImage, rest.productData]);

  return (
    <div
      className={`image-optimized-container ${className}`}
      style={containerStyle}
    >
      <img
        src={src}
        alt={alt}
        loading={lazy ? loadingPriority : 'eager'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={imageStyle}
        {...rest}
      />
      
      {!loaded && !error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <div className="text-red-500 text-sm">Image failed to load</div>
        </div>
      )}
    </div>
  );
};

export default ImageOptimized; 