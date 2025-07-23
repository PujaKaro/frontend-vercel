import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faBan,
  faTrash,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faEdit,
  faCommentDots,
  faEnvelope,
  faCog,
  faMapMarkerAlt,
  faPhone,
  faEnvelope as faEnvelopeIcon,
  faCalendar,
  faClock,
  faIndianRupeeSign,
  faTag,
  faStar,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faCreditCard,
  faFileInvoice,
  faPrint,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { sendBookingNotification, sendReviewRequestNotification } from '../utils/notificationUtils';
import BookingReviewForm from './BookingReviewForm';
import BookingInvoice from './BookingInvoice';

const BookingManagementTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore timestamps to Date objects, with proper checks
        const formattedData = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt,
          date: data.date && typeof data.date.toDate === 'function' ? data.date.toDate() : data.date,
          reviewRequestedAt: data.reviewRequestedAt && typeof data.reviewRequestedAt.toDate === 'function' ? 
            data.reviewRequestedAt.toDate() : data.reviewRequestedAt,
          updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? 
            data.updatedAt.toDate() : data.updatedAt,
          reviewedAt: data.reviewedAt && typeof data.reviewedAt.toDate === 'function' ? 
            data.reviewedAt.toDate() : data.reviewedAt,
          paymentReceivedAt: data.paymentReceivedAt && typeof data.paymentReceivedAt.toDate === 'function' ? 
            data.paymentReceivedAt.toDate() : data.paymentReceivedAt
        };
        
        return formattedData;
      });
      
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        toast.error('Booking not found');
        return;
      }

      const bookingData = bookingDoc.data();
      const oldStatus = bookingData.status;

      // Prepare update data
      const updateData = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };

      // Add payment received timestamp if status is payment_received
      if (newStatus === 'payment_received') {
        updateData.paymentReceivedAt = serverTimestamp();
        updateData.paymentStatus = 'received';
      }

      // Update booking status
      await updateDoc(bookingRef, updateData);

      // Send notification to user if userId exists
      if (bookingData.userId) {
        await sendBookingNotification(
          bookingData.userId,
          bookingId,
          newStatus,
          bookingData.pujaName || 'your puja'
        );
      }

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { 
                ...booking, 
                status: newStatus, 
                updatedAt: new Date(),
                ...(newStatus === 'payment_received' && {
                  paymentReceivedAt: new Date(),
                  paymentStatus: 'received'
                })
              }
            : booking
        )
      );

      // Update selected booking if it's the current one
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => ({ 
          ...prev, 
          status: newStatus, 
          updatedAt: new Date(),
          ...(newStatus === 'payment_received' && {
            paymentReceivedAt: new Date(),
            paymentStatus: 'received'
          })
        }));
      }

      // Show appropriate messages
      if (newStatus === 'payment_received') {
        toast.success('Payment marked as received. Invoice can now be generated.');
      } else if (newStatus === 'completed') {
        toast.success(`Booking marked as completed. You can now request a review from the customer.`);
      } else {
        toast.success(`Booking ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      
      // Close modal if the deleted booking was selected
      if (selectedBooking && selectedBooking.id === bookingId) {
        setShowManageModal(false);
        setSelectedBooking(null);
      }
      
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleRequestReview = async (booking) => {
    try {
      // Update the booking to mark review as requested
      await updateDoc(doc(db, 'bookings', booking.id), {
        reviewRequested: true,
        reviewRequestedAt: serverTimestamp()
      });

      // Send notification to user
      if (booking.userId) {
        await sendReviewRequestNotification(
          booking.userId,
          booking.id,
          booking.pujaName || 'your puja'
        );
      }

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === booking.id
            ? { ...b, reviewRequested: true, reviewRequestedAt: new Date() }
            : b
        )
      );

      // Update selected booking if it's the current one
      if (selectedBooking && selectedBooking.id === booking.id) {
        setSelectedBooking(prev => ({ ...prev, reviewRequested: true, reviewRequestedAt: new Date() }));
      }

      toast.success('Review request sent to customer');
    } catch (error) {
      console.error('Error requesting review:', error);
      toast.error('Failed to send review request');
    }
  };

  const handleReviewSubmitted = (reviewId) => {
    // Update the booking in the list to show it has a review
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === selectedBookingForReview.id
          ? { ...booking, hasReview: true, reviewId }
          : booking
      )
    );
    
    // Update selected booking if it's the current one
    if (selectedBooking && selectedBooking.id === selectedBookingForReview.id) {
      setSelectedBooking(prev => ({ ...prev, hasReview: true, reviewId }));
    }
    
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
  };

  const openManageModal = (booking) => {
    setSelectedBooking(booking);
    setShowManageModal(true);
  };

  const handleInvoiceActions = {
    onClose: () => setShowInvoice(false),
    onPrint: () => {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Create clean print content without problematic icons
      const printContent = `
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
              <div class="company-info">
                <div>
                  <h1>Pujakaro</h1>
                  <p>Sacred Services & Spiritual Solutions</p>
                </div>
                <div class="mt-4">
                  <p>G-275, Molarband Extn.</p>
                  <p>Delhi - 110044</p>
                  <p>Phone: +91 7982545360</p>
                  <p>Email: info@pujakaro.in</p>
                </div>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <div>
                  <p><strong>Invoice #:</strong> INV-${selectedBooking.id.slice(-8).toUpperCase()}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Due Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Status:</strong> ${selectedBooking.paymentStatus === 'received' ? 'Paid' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bill To Section -->
          <div class="bill-to">
            <div class="bill-to-grid">
              <div class="section">
                <h3>Bill To:</h3>
                <div>
                  <p class="customer-name">${selectedBooking.userName}</p>
                  <p>Email: ${selectedBooking.userEmail}</p>
                  <p>Phone: ${selectedBooking.phone}</p>
                  <p>Address: ${selectedBooking.address}, ${selectedBooking.city}</p>
                  <p>${selectedBooking.state} - ${selectedBooking.pincode}</p>
                </div>
              </div>
              <div class="section">
                <h3>Service Details:</h3>
                <div>
                  <p><strong>Puja Name:</strong> ${selectedBooking.pujaName}</p>
                  <p><strong>Puja ID:</strong> ${selectedBooking.pujaId}</p>
                  <p><strong>Date:</strong> ${selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() : selectedBooking.date}</p>
                  <p><strong>Time:</strong> ${selectedBooking.time}</p>
                  <p><strong>Booking ID:</strong> ${selectedBooking.id}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="items-section">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <p class="service-name">${selectedBooking.pujaName}</p>
                      <p class="service-desc">Puja service on ${selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() : selectedBooking.date} at ${selectedBooking.time}</p>
                      ${selectedBooking.specialInstructions ? `<p class="special-instructions"><strong>Special Instructions:</strong> ${selectedBooking.specialInstructions}</p>` : ''}
                    </div>
                  </td>
                  <td class="amount">Rs. ${(selectedBooking.price || 0).toLocaleString()}</td>
                </tr>
                ${selectedBooking.discountApplied > 0 ? `
                  <tr class="discount-row">
                    <td>
                      <div>
                        <span class="discount-label">${selectedBooking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}</span>
                        ${selectedBooking.referralCode ? `<span class="discount-code">(${selectedBooking.referralCode})</span>` : ''}
                      </div>
                    </td>
                    <td class="discount-amount">-Rs. ${((selectedBooking.price || 0) * selectedBooking.discountApplied / 100).toLocaleString()}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="totals">
            <div class="totals-content">
              <div class="totals-table">
                <div class="row">
                  <span>Subtotal:</span>
                  <span>Rs. ${(selectedBooking.price || 0).toLocaleString()}</span>
                </div>
                ${selectedBooking.discountApplied > 0 ? `
                  <div class="row">
                    <span>Discount:</span>
                    <span class="discount-text">-Rs. ${((selectedBooking.price || 0) * selectedBooking.discountApplied / 100).toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="total-row">
                  <span>Total:</span>
                  <span class="total-amount">Rs. ${((selectedBooking.price || 0) - ((selectedBooking.price || 0) * (selectedBooking.discountApplied || 0) / 100)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="payment-info">
            <h3>Payment Information</h3>
            <div class="payment-grid">
              <div>
                <p><strong>Payment Method:</strong> Online Payment / UPI</p>
              </div>
              <div>
                <p><strong>Payment Status:</strong> ${selectedBooking.paymentStatus === 'received' ? 'Paid' : 'Pending'}</p>
              </div>
            </div>
          </div>

          <!-- Terms and Notes -->
          <div class="terms">
            <div class="terms-grid">
              <div>
                <h4>Terms & Conditions:</h4>
                <ul>
                  <li>Payment is due upon receipt of this invoice</li>
                  <li>Service will be provided as per scheduled date and time</li>
                  <li>Cancellation policy applies as per terms</li>
                  <li>For any queries, contact us at info@pujakaro.in</li>
                </ul>
              </div>
              <div>
                <h4>Notes:</h4>
                <p>Thank you for choosing Pujakaro for your spiritual needs.</p>
                <p>We appreciate your trust in our services.</p>
                ${selectedBooking.additionalInfo ? `
                  <div class="additional-info">
                    <p class="label"><strong>Additional Information:</strong></p>
                    <p class="content">${selectedBooking.additionalInfo}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2024 Pujakaro. All rights reserved. | Sacred Services & Spiritual Solutions</p>
          </div>
        </div>
      `;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - INV-${selectedBooking.id.slice(-8).toUpperCase()}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .invoice-container { 
                  max-width: none !important; 
                  margin: 0 !important; 
                  box-shadow: none !important;
                  border: none !important;
                }
              }
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333;
                background: white;
                margin: 0;
                padding: 0;
              }
              .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 0;
              }
              .header { 
                border-bottom: 2px solid #e5e7eb; 
                padding: 20px 0; 
              }
              .header-content { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
              }
              .company-info h1 { 
                margin: 0; 
                color: #111827; 
                font-size: 24px; 
              }
              .company-info p { 
                margin: 5px 0; 
                color: #6b7280; 
                font-size: 14px;
              }
              .invoice-info { 
                text-align: right; 
              }
              .invoice-info h2 { 
                margin: 0 0 10px 0; 
                color: #111827; 
                font-size: 28px; 
              }
              .invoice-info p { 
                margin: 3px 0; 
                color: #6b7280; 
                font-size: 14px; 
              }
              .bill-to { 
                padding: 20px 0; 
                border-bottom: 1px solid #e5e7eb; 
              }
              .bill-to-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 30px; 
              }
              .section h3 { 
                margin: 0 0 15px 0; 
                color: #111827; 
                font-size: 18px; 
              }
              .section p { 
                margin: 5px 0; 
                color: #374151; 
                font-size: 14px; 
              }
              .customer-name {
                font-size: 16px;
                font-weight: 600;
                color: #111827;
              }
              .items-section {
                padding: 20px 0;
              }
              .items-table { 
                width: 100%; 
                border-collapse: collapse;
              }
              .items-table th { 
                text-align: left; 
                padding: 12px; 
                border-bottom: 1px solid #e5e7eb; 
                color: #111827; 
                font-weight: 600; 
                font-size: 14px;
              }
              .items-table td { 
                padding: 12px; 
                border-bottom: 1px solid #f3f4f6; 
                vertical-align: top;
              }
              .service-name {
                font-weight: 600;
                color: #111827;
                margin: 0 0 5px 0;
              }
              .service-desc {
                color: #6b7280;
                font-size: 13px;
                margin: 0 0 5px 0;
              }
              .special-instructions {
                color: #6b7280;
                font-size: 13px;
                margin: 0;
              }
              .amount {
                text-align: right;
                font-weight: 600;
                color: #111827;
              }
              .discount-row {
                background-color: #f0fdf4;
              }
              .discount-label {
                color: #059669;
                font-weight: 600;
              }
              .discount-code {
                color: #6b7280;
                font-size: 12px;
                margin-left: 5px;
              }
              .discount-amount {
                text-align: right;
                color: #059669;
                font-weight: 600;
              }
              .totals { 
                padding: 20px 0; 
                border-top: 1px solid #e5e7eb; 
              }
              .totals-content { 
                display: flex; 
                justify-content: flex-end; 
              }
              .totals-table { 
                width: 250px; 
              }
              .totals-table .row { 
                display: flex; 
                justify-content: space-between; 
                margin: 5px 0; 
                font-size: 14px;
              }
              .totals-table .total-row { 
                border-top: 1px solid #e5e7eb; 
                padding-top: 10px; 
                font-weight: bold; 
                font-size: 18px; 
              }
              .discount-text {
                color: #059669;
              }
              .total-amount {
                color: #2563eb;
              }
              .payment-info { 
                background: #f9fafb; 
                padding: 20px; 
                border-top: 1px solid #e5e7eb; 
              }
              .payment-info h3 {
                margin: 0 0 15px 0;
                color: #111827;
                font-size: 16px;
              }
              .payment-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
              }
              .payment-grid p {
                margin: 5px 0;
                color: #374151;
                font-size: 14px;
              }
              .terms { 
                padding: 20px 0; 
                border-top: 1px solid #e5e7eb; 
              }
              .terms-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 30px; 
              }
              .terms h4 {
                margin: 0 0 10px 0;
                color: #111827;
                font-size: 16px;
              }
              .terms p {
                margin: 5px 0;
                color: #374151;
                font-size: 14px;
              }
              .terms ul {
                margin: 10px 0;
                padding-left: 20px;
              }
              .terms li {
                margin: 3px 0;
                color: #374151;
                font-size: 14px;
              }
              .additional-info { 
                background: #dbeafe; 
                padding: 10px; 
                border-radius: 4px; 
                margin-top: 10px; 
              }
              .additional-info .label { 
                font-weight: 600; 
                color: #1e40af; 
                margin: 0 0 5px 0;
              }
              .additional-info .content { 
                color: #1e3a8a; 
                margin: 0;
              }
              .footer { 
                background: #111827; 
                color: white; 
                text-align: center; 
                padding: 15px; 
              }
              .footer p { 
                margin: 0; 
                font-size: 14px; 
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    },
    onDownload: async () => {
      try {
        // Dynamically import jsPDF to avoid SSR issues
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Set font
        pdf.setFont('helvetica');
        
        // Invoice details
        const invoiceNumber = `INV-${selectedBooking.id.slice(-8).toUpperCase()}`;
        const invoiceDate = new Date().toLocaleDateString('en-IN');
        const dueDate = new Date().toLocaleDateString('en-IN');
        
        // Helper functions
        const calculateSubtotal = () => selectedBooking.price || 0;
        const calculateDiscount = () => {
          if (selectedBooking.discountApplied && selectedBooking.discountApplied > 0) {
            return (calculateSubtotal() * selectedBooking.discountApplied) / 100;
          }
          return 0;
        };
        const calculateTotal = () => calculateSubtotal() - calculateDiscount();
        const getPaymentStatus = () => selectedBooking.paymentStatus === 'received' ? 'Paid' : 'Pending';
        
        // Try to add company logo image with better error handling
        let logoAdded = false;
        
        try {
          // Try multiple logo paths
          const logoPaths = [
            '/images/pujakaro_logo_desktop.png',
            '/images/pujakaro_logo_mobile.png',
            '/images/logo_desktop.svg'
          ];
          
          for (const logoPath of logoPaths) {
            try {
              const logoImg = new Image();
              logoImg.crossOrigin = 'anonymous';
              logoImg.src = logoPath;
              
              await new Promise((resolve, reject) => {
                logoImg.onload = () => {
                  try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 40;
                    const maxHeight = 20;
                    let logoWidth = logoImg.width;
                    let logoHeight = logoImg.height;
                    
                    // Scale down if too large
                    if (logoWidth > maxWidth) {
                      const ratio = maxWidth / logoWidth;
                      logoWidth = maxWidth;
                      logoHeight = logoHeight * ratio;
                    }
                    if (logoHeight > maxHeight) {
                      const ratio = maxHeight / logoHeight;
                      logoHeight = maxHeight;
                      logoWidth = logoWidth * ratio;
                    }
                    
                    // Add logo to PDF
                    pdf.addImage(logoImg, 'PNG', 20, 15, logoWidth, logoHeight);
                    
                    // Add company name next to logo
                    pdf.setFontSize(24);
                    pdf.setTextColor(17, 24, 39);
                    pdf.text('Pujakaro', 25 + logoWidth, 30);
                    
                    logoAdded = true;
                    resolve();
                  } catch (error) {
                    console.log(`Could not add logo from ${logoPath}:`, error);
                    reject(error);
                  }
                };
                logoImg.onerror = () => {
                  console.log(`Logo not found at ${logoPath}`);
                  reject(new Error(`Logo not found at ${logoPath}`));
                };
                // Set a timeout in case the image doesn't load
                setTimeout(() => reject(new Error(`Logo load timeout for ${logoPath}`)), 3000);
              });
              
              if (logoAdded) break; // Exit loop if logo was successfully added
              
            } catch (error) {
              console.log(`Failed to load logo from ${logoPath}:`, error);
              continue; // Try next logo path
            }
          }
        } catch (error) {
          console.log('All logo attempts failed:', error);
        }
        
        // If no logo was added, use text-based fallback
        if (!logoAdded) {
          console.log('Using text-based logo fallback');
          
          // Create a decorative header with text-based logo
          pdf.setFontSize(20);
          pdf.setTextColor(37, 99, 235);
          pdf.text('🕉', 20, 25); // Om symbol
          
          // Add company name
          pdf.setFontSize(24);
          pdf.setTextColor(17, 24, 39);
          pdf.text('Pujakaro', 35, 30);
          
          // Add decorative line
          pdf.setDrawColor(37, 99, 235);
          pdf.setLineWidth(0.5);
          pdf.line(20, 35, 80, 35);
          
          // Add tagline
          pdf.setFontSize(12);
          pdf.setTextColor(107, 114, 128);
          pdf.text('Sacred Services & Spiritual Solutions', 20, 45);
        } else {
          // If logo was added, add tagline below
          pdf.setFontSize(12);
          pdf.setTextColor(107, 114, 128);
          pdf.text('Sacred Services & Spiritual Solutions', 20, 45);
        }
        
        // Company contact information
        pdf.text('G-275, Molarband Extn.', 20, 50);
        pdf.text('Delhi - 110044', 20, 55);
        pdf.text('Phone: +91 7982545360', 20, 60);
        pdf.text('Email: info@pujakaro.in', 20, 65);
        
        // Invoice title and details
        pdf.setFontSize(28);
        pdf.setTextColor(17, 24, 39);
        pdf.text('INVOICE', 140, 30);
        
        pdf.setFontSize(12);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Invoice #: ${invoiceNumber}`, 140, 45);
        pdf.text(`Date: ${invoiceDate}`, 140, 50);
        pdf.text(`Due Date: ${dueDate}`, 140, 55);
        pdf.text(`Status: ${getPaymentStatus()}`, 140, 60);
        
        // Bill to section
        pdf.setFontSize(16);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Bill To:', 20, 90);
        
        pdf.setFontSize(12);
        pdf.setTextColor(55, 65, 81);
        pdf.text(selectedBooking.userName, 20, 100);
        pdf.text(selectedBooking.userEmail, 20, 105);
        pdf.text(selectedBooking.phone, 20, 110);
        
        // Handle long addresses with text wrapping
        const addressLine1 = `${selectedBooking.address}, ${selectedBooking.city}`;
        const addressLine2 = `${selectedBooking.state} - ${selectedBooking.pincode}`;
        
        // Split long address lines
        const maxWidth = 80;
        const addressLines1 = pdf.splitTextToSize(addressLine1, maxWidth);
        const addressLines2 = pdf.splitTextToSize(addressLine2, maxWidth);
        
        let currentY = 115;
        addressLines1.forEach(line => {
          pdf.text(line, 20, currentY);
          currentY += 5;
        });
        addressLines2.forEach(line => {
          pdf.text(line, 20, currentY);
          currentY += 5;
        });
        
        // Service details
        pdf.text('Service Details:', 120, 90);
        pdf.text(`Puja Name: ${selectedBooking.pujaName}`, 120, 100);
        pdf.text(`Puja ID: ${selectedBooking.pujaId}`, 120, 105);
        pdf.text(`Date: ${selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() : selectedBooking.date}`, 120, 110);
        pdf.text(`Time: ${selectedBooking.time}`, 120, 115);
        pdf.text(`Booking ID: ${selectedBooking.id}`, 120, 120);
        
        // Items table - start after address section
        const tableStartY = Math.max(currentY + 10, 140);
        
        pdf.setFontSize(14);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Description', 20, tableStartY);
        pdf.text('Amount', 150, tableStartY);
        
        // Draw table header line
        pdf.setDrawColor(229, 231, 235);
        pdf.line(20, tableStartY + 2, 190, tableStartY + 2);
        
        pdf.setFontSize(12);
        pdf.setTextColor(55, 65, 81);
        
        // Service description
        const serviceDesc = `Puja service on ${selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() : selectedBooking.date} at ${selectedBooking.time}`;
        const descLines = pdf.splitTextToSize(serviceDesc, 120);
        
        pdf.text(selectedBooking.pujaName, 20, tableStartY + 15);
        let descY = tableStartY + 20;
        descLines.forEach(line => {
          pdf.text(line, 20, descY);
          descY += 5;
        });
        
        // Special instructions if any
        if (selectedBooking.specialInstructions) {
          const specialLines = pdf.splitTextToSize(`Special Instructions: ${selectedBooking.specialInstructions}`, 120);
          specialLines.forEach(line => {
            pdf.text(line, 20, descY);
            descY += 5;
          });
        }
        
        // Amount
        pdf.text(`Rs. ${calculateSubtotal().toLocaleString()}`, 150, tableStartY + 15);
        
        let currentTableY = descY + 5;
        
        // Discount row if applicable
        if (selectedBooking.discountApplied > 0) {
          pdf.setTextColor(5, 150, 105);
          const discountText = `${selectedBooking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'} (${selectedBooking.referralCode || ''})`;
          const discountLines = pdf.splitTextToSize(discountText, 120);
          
          discountLines.forEach(line => {
            pdf.text(line, 20, currentTableY);
            currentTableY += 5;
          });
          pdf.text(`-Rs. ${calculateDiscount().toLocaleString()}`, 150, currentTableY - (discountLines.length * 5));
          currentTableY += 5;
        }
        
        // Draw table bottom line
        pdf.setDrawColor(229, 231, 235);
        pdf.line(20, currentTableY + 2, 190, currentTableY + 2);
        
        // Totals section
        const totalsStartY = currentTableY + 15;
        pdf.setFontSize(14);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Subtotal:', 120, totalsStartY);
        pdf.text(`Rs. ${calculateSubtotal().toLocaleString()}`, 170, totalsStartY);
        
        if (selectedBooking.discountApplied > 0) {
          pdf.setTextColor(5, 150, 105);
          pdf.text('Discount:', 120, totalsStartY + 10);
          pdf.text(`-Rs. ${calculateDiscount().toLocaleString()}`, 170, totalsStartY + 10);
        }
        
        // Total line
        pdf.setDrawColor(229, 231, 235);
        pdf.line(120, totalsStartY + 15, 190, totalsStartY + 15);
        
        pdf.setFontSize(16);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Total:', 120, totalsStartY + 25);
        pdf.text(`Rs. ${calculateTotal().toLocaleString()}`, 170, totalsStartY + 25);
        
        // Payment information
        const paymentStartY = totalsStartY + 40;
        pdf.setFontSize(14);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Payment Information', 20, paymentStartY);
        
        pdf.setFontSize(12);
        pdf.setTextColor(55, 65, 81);
        pdf.text('Payment Method: Online Payment / UPI', 20, paymentStartY + 10);
        pdf.text(`Payment Status: ${getPaymentStatus()}`, 20, paymentStartY + 15);
        
        // Terms and conditions
        const termsStartY = paymentStartY + 30;
        pdf.setFontSize(14);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Terms & Conditions:', 20, termsStartY);
        
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        const terms = [
          '• Payment is due upon receipt of this invoice',
          '• Service will be provided as per scheduled date and time',
          '• Cancellation policy applies as per terms',
          '• For any queries, contact us at info@pujakaro.in'
        ];
        
        terms.forEach((term, index) => {
          pdf.text(term, 20, termsStartY + 10 + (index * 5));
        });
        
        // Additional information if any
        if (selectedBooking.additionalInfo) {
          const additionalStartY = termsStartY + 35;
          pdf.setFontSize(12);
          pdf.setTextColor(30, 64, 175);
          pdf.text('Additional Information:', 20, additionalStartY);
          pdf.setFontSize(10);
          pdf.setTextColor(30, 58, 138);
          const additionalLines = pdf.splitTextToSize(selectedBooking.additionalInfo, 170);
          additionalLines.forEach((line, index) => {
            pdf.text(line, 20, additionalStartY + 8 + (index * 5));
          });
        }
        
        // Footer
        const footerY = 270;
        pdf.setFillColor(17, 24, 39);
        pdf.rect(0, footerY, 210, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text('© 2024 Pujakaro. All rights reserved. | Sacred Services & Spiritual Solutions', 105, footerY + 15, { align: 'center' });
        
        // Save the PDF
        pdf.save(`Invoice-${invoiceNumber}.pdf`);
        toast.success('PDF downloaded successfully!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error generating PDF. Please try again.');
      }
    },
    onEmail: () => {
      // TODO: Implement email functionality
      toast.success('Email functionality will be implemented soon');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'payment_received':
        return <FontAwesomeIcon icon={faCreditCard} className="text-purple-500" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      case 'confirmed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />;
      case 'pending':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'payment_received':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusFlow = (currentStatus) => {
    const flow = [
      { status: 'pending', label: 'Pending', color: 'text-yellow-600' },
      { status: 'confirmed', label: 'Confirmed', color: 'text-blue-600' },
      { status: 'payment_received', label: 'Payment Received', color: 'text-purple-600' },
      { status: 'completed', label: 'Completed', color: 'text-green-600' }
    ];

    const currentIndex = flow.findIndex(step => step.status === currentStatus);
    
    return flow.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: step.status === currentStatus
    }));
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.pujaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          // Handle different date formats
          const dateA = a.date instanceof Date ? a.date.getTime() : 
                        typeof a.date === 'string' ? new Date(a.date).getTime() : 0;
          const dateB = b.date instanceof Date ? b.date.getTime() : 
                        typeof b.date === 'string' ? new Date(b.date).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'created':
          // Handle different date formats
          const createdA = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                          typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                          typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0;
          comparison = createdA - createdB;
          break;
        case 'name':
          comparison = (a.pujaName || '').localeCompare(b.pujaName || '');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={fetchBookings}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="payment_received">Payment Received</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faSort} className="mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puja Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.pujaName}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {booking.pujaId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.userName}</div>
                  <div className="text-sm text-gray-500">{booking.userEmail}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.date instanceof Date ? booking.date.toLocaleDateString() : 
                     typeof booking.date === 'string' ? booking.date : 'Date not available'}
                  </div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                    {booking.finalPrice?.toLocaleString() || booking.price?.toLocaleString()}
                  </div>
                  {booking.discountApplied > 0 && (
                    <div className="text-xs text-green-600">
                      {booking.discountType === 'coupon' ? 'Coupon' : 'Discount'}: {booking.discountApplied}%
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openManageModal(booking)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Manage Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Booking Management Modal */}
      {showManageModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Manage Booking</h3>
                  <p className="text-sm text-gray-500 mt-1">Booking ID: {selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Flow */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Status Flow</h4>
                <div className="flex items-center justify-between">
                  {getStatusFlow(selectedBooking.status).map((step, index) => (
                    <div key={step.status} className="flex items-center">
                      <div className={`flex items-center ${step.isActive ? step.color : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          step.isCurrent 
                            ? 'border-current bg-current text-white' 
                            : step.isActive 
                              ? 'border-current bg-white' 
                              : 'border-gray-300 bg-white'
                        }`}>
                          {step.isActive ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${step.isActive ? step.color : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {index < getStatusFlow(selectedBooking.status).length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 ${step.isActive ? 'bg-current' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Current Status</h4>
                    <div className="flex items-center mt-2">
                      {getStatusIcon(selectedBooking.status)}
                      <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-2" />
                          {updatingStatus ? 'Confirming...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faBan} className="mr-2" />
                          {updatingStatus ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'payment_received')}
                        disabled={updatingStatus}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                        {updatingStatus ? 'Marking Payment...' : 'Mark Payment Received'}
                      </button>
                    )}
                    {selectedBooking.status === 'payment_received' && (
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                        disabled={updatingStatus}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        {updatingStatus ? 'Completing...' : 'Mark as Completed'}
                      </button>
                    )}
                    {selectedBooking.status === 'completed' && !selectedBooking.hasReview && !selectedBooking.reviewRequested && (
                      <button
                        onClick={() => handleRequestReview(selectedBooking)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                        Request Review
                      </button>
                    )}
                    {selectedBooking.status === 'completed' && selectedBooking.reviewRequested && !selectedBooking.hasReview && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(selectedBooking);
                          setShowReviewForm(true);
                          setShowManageModal(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                        Submit Review
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Section for Payment Received and Completed */}
              {(selectedBooking.status === 'payment_received' || selectedBooking.status === 'completed') && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faFileInvoice} className="mr-2 text-blue-500" />
                    Invoice Management
                  </h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
                      View Invoice
                    </button>
                    <button
                      onClick={() => {
                        setShowInvoice(true);
                        // Auto-print after modal opens
                        setTimeout(() => {
                          window.print();
                        }, 500);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faPrint} className="mr-2" />
                      Print Invoice
                    </button>
                    <button
                      onClick={handleInvoiceActions.onDownload}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Download PDF
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>View Invoice:</strong> Opens invoice in a modal for preview</p>
                    <p><strong>Print Invoice:</strong> Opens invoice and automatically triggers print dialog</p>
                    <p><strong>Download PDF:</strong> Generates and downloads a PDF file</p>
                  </div>
                </div>
              )}

              {/* Puja Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" />
                    Puja Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Puja Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.pujaName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Puja ID</label>
                      <p className="text-sm text-gray-900">{selectedBooking.pujaId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() :
                         typeof selectedBooking.date === 'string' ? selectedBooking.date : 'Date not available'} at {selectedBooking.time}
                      </p>
                    </div>
                    {selectedBooking.specialInstructions && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                        <p className="text-sm text-gray-900">{selectedBooking.specialInstructions}</p>
                      </div>
                    )}
                    {selectedBooking.additionalInfo && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Additional Information</label>
                        <p className="text-sm text-gray-900">{selectedBooking.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faEnvelopeIcon} className="mr-2 text-green-500" />
                    Customer Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faEnvelopeIcon} className="mr-2 text-gray-400" />
                        {selectedBooking.userEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                        {selectedBooking.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">User ID</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedBooking.userId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                  Address Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{selectedBooking.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <p className="text-sm text-gray-900">{selectedBooking.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <p className="text-sm text-gray-900">{selectedBooking.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <p className="text-sm text-gray-900">{selectedBooking.pincode}</p>
                  </div>
                  {selectedBooking.location && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Coordinates</label>
                      <p className="text-sm text-gray-900">
                        Lat: {selectedBooking.location.latitude}, Long: {selectedBooking.location.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2 text-green-500" />
                  Financial Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Original Price</label>
                    <p className="text-lg font-semibold text-gray-900">
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                      {selectedBooking.price?.toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.discountApplied > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {selectedBooking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        -{selectedBooking.discountApplied}%
                      </p>
                      {selectedBooking.referralCode && (
                        <p className="text-sm text-gray-500">Code: {selectedBooking.referralCode}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Final Price</label>
                    <p className="text-lg font-semibold text-blue-600">
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                      {selectedBooking.finalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                  Timestamps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">
                      {selectedBooking.createdAt instanceof Date ? selectedBooking.createdAt.toLocaleString() :
                       typeof selectedBooking.createdAt === 'string' ? selectedBooking.createdAt : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {selectedBooking.updatedAt instanceof Date ? selectedBooking.updatedAt.toLocaleString() :
                       typeof selectedBooking.updatedAt === 'string' ? selectedBooking.updatedAt : 'Not available'}
                    </p>
                  </div>
                  {selectedBooking.paymentReceivedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Received At</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.paymentReceivedAt instanceof Date ? selectedBooking.paymentReceivedAt.toLocaleString() :
                         typeof selectedBooking.paymentReceivedAt === 'string' ? selectedBooking.paymentReceivedAt : 'Not available'}
                      </p>
                    </div>
                  )}
                  {selectedBooking.reviewRequestedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Review Requested At</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.reviewRequestedAt instanceof Date ? selectedBooking.reviewRequestedAt.toLocaleString() :
                         typeof selectedBooking.reviewRequestedAt === 'string' ? selectedBooking.reviewRequestedAt : 'Not available'}
                      </p>
                    </div>
                  )}
                  {selectedBooking.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reviewed At</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.reviewedAt instanceof Date ? selectedBooking.reviewedAt.toLocaleString() :
                         typeof selectedBooking.reviewedAt === 'string' ? selectedBooking.reviewedAt : 'Not available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Status */}
              {selectedBooking.status === 'completed' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
                    Review Status
                  </h4>
                  <div className="flex items-center space-x-4">
                    {selectedBooking.hasReview ? (
                      <div className="flex items-center text-green-600">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        <span>Review submitted</span>
                        {selectedBooking.reviewId && (
                          <span className="ml-2 text-sm text-gray-500">ID: {selectedBooking.reviewId}</span>
                        )}
                      </div>
                    ) : selectedBooking.reviewRequested ? (
                      <div className="flex items-center text-yellow-600">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                        <span>Review requested - waiting for customer response</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        <span>No review requested yet</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedBooking(selectedBooking);
                      setShowEmailModal(true);
                      setShowManageModal(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleDelete(selectedBooking.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete Booking
                  </button>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <BookingInvoice
              booking={selectedBooking}
              {...handleInvoiceActions}
            />
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Submit Review</h3>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setSelectedBookingForReview(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <BookingReviewForm
              booking={selectedBookingForReview}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementTab; 