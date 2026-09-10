import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import BookCard from '../components/BookCard';
import { bookService } from '../services/bookService';
import { Book } from '../types';

const CATEGORIES = ['Fiction', 'Science Fiction', 'Fantasy', 'Classic', 'Romance', 'Self-Help', 'Philosophy'];

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getAllBooks()
      .then((books) => setFeaturedBooks(books.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBanner />

      {/* Category Quick Links */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="page-container">
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Browse by Genre</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/catalogue?category=${cat}`}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2
                           rounded-full text-sm font-medium transition-colors duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
              <p className="text-gray-500 mt-1">Hand-picked selections just for you</p>
            </div>
            <Link
              to="/catalogue"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why BookStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: 'Fast Delivery', desc: 'Get your books delivered within 2-3 business days across India.' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive prices on all genres with frequent discounts and deals.' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Shop safely with our end-to-end encrypted payment gateway.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to find your next book?</h2>
          <p className="text-blue-200 text-lg mb-8">Join thousands of happy readers today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/catalogue" className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
              Start Browsing
            </Link>
            <Link to="/register" className="bg-white/20 border border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/30 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8">
        <div className="page-container text-center">
          <p className="text-2xl mb-2">📚 BookStore</p>
          <p className="text-sm">© {new Date().getFullYear()} BookStore. Built with React + Spring Boot + MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
