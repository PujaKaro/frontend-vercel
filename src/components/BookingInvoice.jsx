import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIndianRupeeSign,
  faDownload,
  faPrint,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faEnvelope as faEnvelopeIcon,
  faCalendar,
  faClock,
  faTag,
  faCheckCircle,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons';

const BookingInvoice = ({ booking, onClose, onDownload, onPrint, onEmail }) => {
  const invoiceNumber = `INV-${booking.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const dueDate = new Date().toLocaleDateString('en-IN');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return booking.price || 0;
  };

  const calculateDiscount = () => {
    if (booking.discountApplied && booking.discountApplied > 0) {
      return (calculateSubtotal() * booking.discountApplied) / 100;
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const getPaymentStatus = () => {
    return booking.paymentStatus === 'received' ? 'Paid' : 'Pending';
  };

  const getPaymentStatusColor = () => {
    return booking.paymentStatus === 'received' ? 'text-green-600' : 'text-red-600';
  };

  const handlePrint = () => {
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
                <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p><strong>Status:</strong> ${getPaymentStatus()}</p>
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
                <p class="customer-name">${booking.userName}</p>
                <p>Email: ${booking.userEmail}</p>
                <p>Phone: ${booking.phone}</p>
                <p>Address: ${booking.address}, ${booking.city}</p>
                <p>${booking.state} - ${booking.pincode}</p>
              </div>
            </div>
            <div class="section">
              <h3>Service Details:</h3>
              <div>
                <p><strong>Puja Name:</strong> ${booking.pujaName}</p>
                <p><strong>Puja ID:</strong> ${booking.pujaId}</p>
                <p><strong>Date:</strong> ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
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
                    <p class="service-name">${booking.pujaName}</p>
                    <p class="service-desc">Puja service on ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date} at ${booking.time}</p>
                    ${booking.specialInstructions ? `<p class="special-instructions"><strong>Special Instructions:</strong> ${booking.specialInstructions}</p>` : ''}
                  </div>
                </td>
                <td class="amount">Rs. ${calculateSubtotal().toLocaleString()}</td>
              </tr>
              ${booking.discountApplied > 0 ? `
                <tr class="discount-row">
                  <td>
                    <div>
                      <span class="discount-label">${booking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}</span>
                      ${booking.referralCode ? `<span class="discount-code">(${booking.referralCode})</span>` : ''}
                    </div>
                  </td>
                  <td class="discount-amount">-Rs. ${calculateDiscount().toLocaleString()}</td>
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
                <span>Rs. ${calculateSubtotal().toLocaleString()}</span>
              </div>
              ${booking.discountApplied > 0 ? `
                <div class="row">
                  <span>Discount:</span>
                  <span class="discount-text">-Rs. ${calculateDiscount().toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>Total:</span>
                <span class="total-amount">Rs. ${calculateTotal().toLocaleString()}</span>
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
              <p><strong>Payment Status:</strong> ${getPaymentStatus()}</p>
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
              ${booking.additionalInfo ? `
                <div class="additional-info">
                  <p class="label"><strong>Additional Information:</strong></p>
                  <p class="content">${booking.additionalInfo}</p>
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
          <title>Invoice - ${invoiceNumber}</title>
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
  };



  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto" id="invoice-content">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6 header">
        <div className="flex justify-between items-start header-content">
          <div className="company-info">
            <div className="flex items-center">
              <img 
                src="/images/pujakaro_logo_desktop.png" 
                alt="Pujakaro" 
                className="h-12 w-auto mr-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pujakaro</h1>
                <p className="text-gray-600">Sacred Services & Spiritual Solutions</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>G-275, Molarband Extn.</p>
              <p>Delhi - 110044</p>
              <p>Phone: +91 7982545360</p>
              <p>Email: info@pujakaro.in</p>
            </div>
          </div>
          <div className="text-right invoice-info">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Invoice #:</span> {invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {invoiceDate}</p>
              <p><span className="font-medium">Due Date:</span> {dueDate}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 font-semibold ${getPaymentStatusColor()}`}>
                  {getPaymentStatus()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="px-8 py-6 border-b border-gray-200 bill-to">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bill-to-grid">
          <div className="section">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium text-lg">{booking.userName}</p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faEnvelopeIcon} className="mr-2 text-gray-400 w-4" />
                {booking.userEmail}
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400 w-4" />
                {booking.phone}
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400 w-4" />
                {booking.address}, {booking.city}
              </p>
              <p className="ml-6">{booking.state} - {booking.pincode}</p>
            </div>
          </div>
          <div className="section">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Details:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Puja Name:</span> {booking.pujaName}</p>
              <p><span className="font-medium">Puja ID:</span> {booking.pujaId}</p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-400 w-4" />
                <span className="font-medium">Date:</span> 
                <span className="ml-1">
                  {booking.date instanceof Date ? booking.date.toLocaleDateString() :
                   typeof booking.date === 'string' ? booking.date : 'Date not available'}
                </span>
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400 w-4" />
                <span className="font-medium">Time:</span> <span className="ml-1">{booking.time}</span>
              </p>
              <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-8 py-6">
        <table className="w-full items-table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-gray-900">{booking.pujaName}</p>
                  <p className="text-sm text-gray-600">
                    Puja service on {booking.date instanceof Date ? booking.date.toLocaleDateString() :
                    typeof booking.date === 'string' ? booking.date : 'Date not available'} at {booking.time}
                  </p>
                  {booking.specialInstructions && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Special Instructions:</span> {booking.specialInstructions}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-medium text-gray-900">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </td>
            </tr>
            {booking.discountApplied > 0 && (
              <tr className="border-b border-gray-100 discount-row">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-green-500" />
                    <span className="text-green-600 font-medium">
                      {booking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}
                    </span>
                    {booking.referralCode && (
                      <span className="ml-2 text-sm text-gray-500">({booking.referralCode})</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-green-600 font-medium">
                    -{formatCurrency(calculateDiscount())}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 py-6 border-t border-gray-200 totals">
        <div className="flex justify-end totals-content">
          <div className="w-64 totals-table">
            <div className="space-y-2">
              <div className="flex justify-between text-sm row">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              {booking.discountApplied > 0 && (
                <div className="flex justify-between text-sm row">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600 font-medium">-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 total-row">
                <span>Total:</span>
                <span className="total-amount">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 payment-info">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 payment-grid">
          <div>
            <p className="text-sm text-gray-600 mb-2">Payment Method:</p>
            <p className="font-medium">Online Payment / UPI</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Payment Status:</p>
            <div className="flex items-center">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className={`mr-2 ${getPaymentStatusColor()}`} 
              />
              <span className={`font-medium ${getPaymentStatusColor()}`}>
                {getPaymentStatus()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="px-8 py-6 border-t border-gray-200 terms">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 terms-grid">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Payment is due upon receipt of this invoice</li>
              <li>• Service will be provided as per scheduled date and time</li>
              <li>• Cancellation policy applies as per terms</li>
              <li>• For any queries, contact us at info@pujakaro.in</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
            <div className="text-sm text-gray-600">
              <p>Thank you for choosing Pujakaro for your spiritual needs.</p>
              <p className="mt-2">We appreciate your trust in our services.</p>
              {booking.additionalInfo && (
                <div className="mt-2 p-2 bg-blue-50 rounded additional-info">
                  <p className="font-medium text-blue-800 label">Additional Information:</p>
                  <p className="text-blue-700 content">{booking.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-900 text-white text-center footer">
        <p className="text-sm">
          © 2024 Pujakaro. All rights reserved. | Sacred Services & Spiritual Solutions
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 action-buttons no-print">
        <div className="flex justify-center space-x-4">
          <button
            onClick={onPrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            Print Invoice
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download PDF
          </button>
          <button
            onClick={onEmail}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Email Invoice
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingInvoice; 