
import React from 'react';
import { StarColor } from '../types';

interface StarRatingProps {
  rating: number; // Assumes 0-5 or 0-10
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
  // Normalize to 0-5 for rendering
  const normalizedRating = max === 10 ? rating / 2 : rating;
  const percentage = (normalizedRating / 5) * 100;
  
  const getStarColorClass = (val: number) => {
    if (val >= 4.5) return StarColor.EXCELLENT;
    if (val >= 3.5) return StarColor.GOOD;
    if (val >= 2.5) return StarColor.AVERAGE;
    if (val >= 1.5) return StarColor.FAIR;
    return StarColor.POOR;
  };

  const colorClass = getStarColorClass(normalizedRating);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="flex relative">
          {/* Background Stars (Empty) */}
          <div className="flex text-gray-200">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {/* Foreground Stars (Filled) */}
          <div 
            className={`flex absolute top-0 left-0 overflow-hidden ${colorClass}`} 
            style={{ width: `${percentage}%` }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <span className="ml-2 font-bold text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${colorClass.replace('text-', 'bg-')}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StarRating;
