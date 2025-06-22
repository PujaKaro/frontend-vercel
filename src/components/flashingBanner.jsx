import React, { useEffect, useState } from 'react';

// Apni images ke URLs ya import path yahan daalein
const flashImages = [
  "/public/images/banner 1.jpeg",
  "/public/images/banner2.jpeg",
  "/public/images/banner3.jpeg",
];

const FlashingBanner = () => {
  const [current, setCurrent] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % flashImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [current]);

  // Manual navigation
  const goTo = (idx) => setCurrent(idx);
  const prev = () =>
    setCurrent((current - 1 + flashImages.length) % flashImages.length);
  const next = () => setCurrent((current + 1) % flashImages.length);

  return (
    <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center overflow-hidden shadow">
      {flashImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Banner ${idx + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
            current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{ cursor: 'pointer' }}
          onClick={next}
        />
      ))}

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 z-20 hover:bg-opacity-60"
        aria-label="Previous"
      >
        &#8592;
      </button>
      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 z-20 hover:bg-opacity-60"
        aria-label="Next"
      >
        &#8594;
      </button>
    </div>
  );
};

export default FlashingBanner;
