import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import { products, pujaServices } from '../data/data';
import ProductDetail from '../pages/ProductDetail';
import PujaDetail from '../pages/PujaDetail';

/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert
 * @returns {string} - The URL-friendly slug
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Remove consecutive hyphens
};

/**
 * Find a product by its slug
 * @param {string} slug - The product slug to search for
 * @returns {Object|null} - The product object or null if not found
 */
export const findProductBySlug = (slug) => {
  return products.find(product => createSlug(product.name) === slug) || null;
};

/**
 * Find a puja service by its slug
 * @param {string} slug - The puja service slug to search for
 * @returns {Object|null} - The puja service object or null if not found
 */
export const findPujaBySlug = (slug) => {
  return pujaServices.find(puja => createSlug(puja.name) === slug) || null;
};

/**
 * Component for SEO-friendly routes using slugs
 */
const SeoRoutes = () => {
  return (
    <Routes>
      {/* SEO-friendly product routes */}
      <Route 
        path="/product/:slug" 
        element={<SlugProductRoute />} 
      />
      
      {/* SEO-friendly puja routes */}
      <Route 
        path="/puja/:slug" 
        element={<SlugPujaRoute />} 
      />
    </Routes>
  );
};

/**
 * Component for handling product routes with slugs
 */
const SlugProductRoute = () => {
  const { slug } = useParams();
  const product = findProductBySlug(slug);
  
  if (!product) {
    return <Navigate to="/not-found" />;
  }
  
  return <ProductDetail id={product.id} />;
};

/**
 * Component for handling puja routes with slugs
 */
const SlugPujaRoute = () => {
  const { slug } = useParams();
  const puja = findPujaBySlug(slug);
  
  if (!puja) {
    return <Navigate to="/not-found" />;
  }
  
  return <PujaDetail id={puja.id} />;
};

export default SeoRoutes; 