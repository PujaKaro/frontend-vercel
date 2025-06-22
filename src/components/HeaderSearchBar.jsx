import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const HeaderSearchBar = () => {
  const [queryText, setQueryText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!queryText.trim()) {
        setSuggestions([]);
        return;
      }
      const snapshot = await getDocs(collection(db, "pujas"));
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(puja =>
          puja.name &&
          puja.name.toLowerCase().startsWith(queryText.toLowerCase())
        )
        .slice(0, 10);
      setSuggestions(filtered);
    };
    fetchSuggestions();
  }, [queryText]);

  const handleSelect = (puja) => {
    setQueryText(puja.name);
    setShowDropdown(false);
    navigate(`/puja-booking/${puja.id}`);
  };

  return (
    <div className="relative w-60 ">
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        placeholder="Search for pujas..."
        value={queryText}
        onChange={e => {
          setQueryText(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && queryText.trim() && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow z-50 mt-1 max-h-60 overflow-y-auto">
          {suggestions.length === 0 ? (
            <li className="px-4 py-2 text-gray-400">No matching results</li>
          ) : (
            suggestions.map(puja => (
              <li
                key={puja.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleSelect(puja)}
              >
                {puja.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default HeaderSearchBar;