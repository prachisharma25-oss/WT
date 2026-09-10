import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const fallbackImage = `https://via.placeholder.com/200x280/1e3a8a/ffffff?text=${encodeURIComponent(book.title.substring(0, 15))}`;

  return (
    <div className="card flex flex-col overflow-hidden group">
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-gray-100 h-56">
        <img
          src={book.coverUrl || fallbackImage}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        {/* Category badge */}
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          {book.category}
        </span>
        {/* Stock badge */}
        {book.stock <= 5 && book.stock > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Only {book.stock} left!
          </span>
        )}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-2"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-blue-600 text-sm font-medium mb-2">{book.author}</p>

        <StarRating rating={book.rating} />

        <p className="text-gray-500 text-xs mt-2 line-clamp-2 flex-1">
          {book.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ₹{(book.price * 83).toFixed(0)}
          </span>
          <span className="text-xs text-gray-400">\${book.price.toFixed(2)} USD</span>
        </div>

        <button
          className="mt-3 btn-primary w-full text-sm"
          disabled={book.stock === 0}
        >
          {book.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
