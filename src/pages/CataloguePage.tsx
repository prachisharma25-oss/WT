import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { bookService } from '../services/bookService';
import { Book } from '../types';

const CATEGORIES = ['All', 'Classic', 'Science Fiction', 'Fantasy', 'Romance', 'Self-Help', 'Philosophy', 'Fiction'];

const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');
  const [searchLoading, setSearchLoading] = useState(false);

  // Load all books initially
  useEffect(() => {
    bookService.getAllBooks()
      .then((books) => {
        setAllBooks(books);
        setDisplayedBooks(books);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Apply category filter from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter + sort logic
  const applyFilters = useCallback(
    (books: Book[], query: string, category: string, sort: string): Book[] => {
      let filtered = books;

      if (category !== 'All') {
        filtered = filtered.filter((b) => b.category === category);
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
        );
      }

      switch (sort) {
        case 'price-asc':
          return [...filtered].sort((a, b) => a.price - b.price);
        case 'price-desc':
          return [...filtered].sort((a, b) => b.price - a.price);
        case 'rating':
          return [...filtered].sort((a, b) => b.rating - a.rating);
        case 'title':
          return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        default:
          return filtered;
      }
    },
    []
  );

  useEffect(() => {
    setDisplayedBooks(applyFilters(allBooks, searchQuery, selectedCategory, sortBy));
  }, [allBooks, searchQuery, selectedCategory, sortBy, applyFilters]);

  // Live search via API (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await bookService.searchBooks(searchQuery);
        setDisplayedBooks(applyFilters(results, '', selectedCategory, sortBy));
      } catch {
        // fallback to local filter
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, applyFilters]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat !== 'All') {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('default');
    setSearchParams({});
    setDisplayedBooks(allBooks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12">
        <div className="page-container">
          <h1 className="text-4xl font-bold mb-2">📚 Book Catalogue</h1>
          <p className="text-gray-300">Discover our complete collection of books</p>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Filters Row */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2.5"
              />
              {searchLoading && (
                <svg className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500"
                  viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2.5 w-full md:w-48"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="title">A–Z</option>
            </select>

            {/* Clear */}
            {(searchQuery || selectedCategory !== 'All' || sortBy !== 'default') && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-gray-900">{displayedBooks.length}</span> books
            {selectedCategory !== 'All' && (
              <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> for "<span className="font-semibold text-gray-700">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : displayedBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={handleClearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CataloguePage;
