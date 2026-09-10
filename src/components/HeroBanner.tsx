import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">📖</div>
        <div className="absolute top-20 right-20 text-6xl">📚</div>
        <div className="absolute bottom-10 left-1/4 text-7xl">✨</div>
        <div className="absolute bottom-20 right-10 text-5xl">🔖</div>
      </div>

      <div className="page-container relative py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            📢 Welcome to the #1 Online Bookstore
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover Your Next
            <span className="block text-blue-400">Great Read</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
            Explore thousands of books across every genre. From timeless classics to
            the latest bestsellers — find the perfect book for every reader.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/catalogue"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl
                         transition-all duration-200 text-lg shadow-lg hover:shadow-blue-500/25"
            >
              Browse Catalogue
            </Link>
            <Link
              to="/register"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold
                         px-8 py-3.5 rounded-xl transition-all duration-200 text-lg backdrop-blur-sm"
            >
              Join Free
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14">
            {[
              { value: '10,000+', label: 'Books Available' },
              { value: '50+', label: 'Genres' },
              { value: '24/7', label: 'Online Access' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-blue-300">{value}</div>
                <div className="text-gray-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,64L60,58.7C120,53,240,43,360,42.7C480,43,600,53,720,58.7C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
