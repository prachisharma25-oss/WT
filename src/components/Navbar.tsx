import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">📚</span>
            <span className="text-xl font-bold tracking-wide">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/catalogue"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Catalogue
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-blue-200 text-sm">
                  Hello, <span className="font-semibold text-white">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-300 hover:text-white py-2 transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/catalogue" className="text-gray-300 hover:text-white py-2 transition-colors" onClick={() => setMenuOpen(false)}>Catalogue</Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-left text-red-300 hover:text-red-200 py-2 transition-colors">
                  Logout ({user?.name})
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white py-2 transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-blue-300 hover:text-blue-200 py-2 transition-colors" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
