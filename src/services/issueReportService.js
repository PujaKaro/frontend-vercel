import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Submit an issue report to the database
 * @param {Object} issueData - The issue report data
 * @param {string} issueData.issueType - Type of issue (calculation, interpretation, display, other)
 * @param {string} issueData.issueDescription - Detailed description of the issue
 * @param {string} [issueData.issueEmail] - Optional email for contact
 * @param {Object} [chartData] - The birth chart data that had the issue
 * @returns {Promise<string>} - The ID of the created document
 */
export const submitIssueReport = async (issueData, chartData = null) => {
  try {
    const issueReport = {
      ...issueData,
      chartData: chartData ? JSON.parse(JSON.stringify(chartData)) : null,
      createdAt: serverTimestamp(),
      status: 'open',
      resolved: false
    };
    
    const docRef = await addDoc(collection(db, 'issueReports'), issueReport);
    console.log('Issue report submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting issue report:', error);
    throw error;
  }
};

/**
 * Get all issue reports (for admin use)
 * @returns {Promise<Array>} - Array of issue reports
 */
export const getIssueReports = async () => {
  // This would be implemented for admin dashboard use
  // Not needed for the current user-facing functionality
}; 