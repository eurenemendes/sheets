
import React from 'react';
import { SheetItem } from '../types';
import StarRating from './StarRating';

interface CardProps {
  item: SheetItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 card-shadow flex flex-col h-full border border-gray-100">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <img 
          src={item.logo} 
          alt={item.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&size=200`;
          }}
        />
        <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500 shadow-sm">
                ID: {item.id.replace('item-', '')}
            </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1" title={item.name}>
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 h-10 italic">
            {item.description || 'Nenhuma descrição fornecida.'}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <StarRating rating={item.rating} />
          
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-gray-900 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Ver Detalhes
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
