import React from 'react';
import { SheetItem } from '../types';
import StarRating from './StarRating';

interface CardProps {
  item: SheetItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 card-shadow flex flex-col h-full border border-gray-100">
      <div className="relative h-24 sm:h-48 bg-gray-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        <img 
          src={item.logo} 
          alt={item.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 transform hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&size=200`;
          }}
        />
        <div className="absolute top-1 right-1 sm:top-3 sm:right-3">
            <span className="px-1.5 py-0.5 bg-white bg-opacity-80 border border-gray-200 rounded-full text-[8px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 shadow-sm">
                ID: {item.id.replace('item-', '')}
            </span>
        </div>
      </div>
      
      <div className="p-2 sm:p-6 flex flex-col flex-grow">
        <div className="mb-2 sm:mb-4">
          <h3 className="text-xs sm:text-xl font-bold text-gray-900 line-clamp-1 mb-0.5 sm:mb-1" title={item.name}>
            {item.name}
          </h3>
          <p className="hidden sm:block text-sm text-gray-500 line-clamp-2 h-10 italic">
            {item.description || 'Nenhuma descrição fornecida.'}
          </p>
        </div>

        <div className="mt-auto space-y-2 sm:space-y-4">
          <div className="scale-75 origin-left sm:scale-100">
            <StarRating rating={item.rating} />
          </div>
          
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-gray-900 hover:bg-indigo-600 text-white font-semibold py-1.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-base transition-colors duration-200"
          >
            {/* Texto curto para mobile */}
            <span className="sm:hidden">Ver</span>
            <span className="hidden sm:inline">Ver Detalhes</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;