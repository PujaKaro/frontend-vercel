// Company configuration for invoices and PDFs
export const companyConfig = {
  name: "PUJAKARO CONNECT PVT LTD",
  tagline: "Sacred Services & Spiritual Solutions",
  address: {
    line1: "G-275, Molarband Extn.",
    line2: "Delhi - 110044"
  },
  contact: {
    phone: "+91 8800627513",
    email: "info@pujakaro.in"
  },
  logo: {
    desktop: "/images/pujakaro_logo_desktop.png",
    mobile: "/images/pujakaro_logo_mobile.png",
    svg: "/images/logo_desktop.svg"
  },
  copyright: "© 2024 Pujakaro. All rights reserved. | Sacred Services & Spiritual Solutions"
};

// Helper function to get full address as string
export const getFullAddress = () => {
  return `${companyConfig.address.line1}, ${companyConfig.address.line2}`;
};

// Helper function to get company contact info for PDFs
export const getCompanyContactInfo = () => {
  return {
    address: getFullAddress(),
    phone: companyConfig.contact.phone,
    email: companyConfig.contact.email
  };
};
