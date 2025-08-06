import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleSearch = () => setShowSearch(!showSearch);
    const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-semibold text-gray-700">
          MangaNest
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-gray-600 font-medium">Home</Link>
          <Link to="/featured" className="hover:text-gray-600 font-medium">Featured</Link>
          <Link to="/about" className="hover:text-gray-600 font-medium">About Us</Link>
           <form onSubmit={handleSubmit} className='relative'>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manga..."
                className="border border-gray-300 p-1 outline-none rounded-sm text-sm w-48"
              />
              
                 <button type="submit" className="absolute  cursor-pointer right-1 top-2">
        <FiSearch/>
      </button>
           </form>
               
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <FiSearch
            className="text-xl cursor-pointer"
            onClick={toggleSearch}
          />
          <button onClick={toggleMenu}>
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showSearch && (
        <div className="md:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Search manga..."
            className="border w-full px-3 py-2 outline-none rounded-md text-sm"
          />
        </div>
      )}

      {/* Side Slide Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex flex-col gap-4 mt-12">
          <Link to="/" onClick={closeMenu} className="text-lg font-medium hover:text-gray-600">Home</Link>
          <Link to="/featured" onClick={closeMenu} className="text-lg font-medium hover:text-gray-600">Featured</Link>
          <Link to="/about" onClick={closeMenu} className="text-lg font-medium hover:text-gray-600">About Us</Link>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
