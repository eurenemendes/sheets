import React, { useState, useEffect, useMemo } from 'react';
import { fetchSheetData } from './services/sheetService';
import { SheetItem } from './types';
import Card from './components/Card';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [items, setItems] = useState<SheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSheetData();
        setItems(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar dados da planilha. Verifique se o link é público.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }, [items, searchTerm, sortBy]);

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Sincronizando com a Planilha...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 bg-opacity-90 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Showcase<span className="text-indigo-600">Pro</span></h1>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Live Sheet Data</p>
                </div>
              </div>
              
              {/* Toggle Noturno Mobile */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 md:hidden hover:bg-gray-200 transition-colors"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar itens..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select 
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-xl border-transparent text-gray-600 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="rating">Melhor Avaliados</option>
                <option value="name">Ordem Alfabética</option>
              </select>

              {/* Toggle Noturno Desktop */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden md:flex p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-indigo-600 transition-all duration-200"
                title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {items.length > 0 && <AIAssistant data={items} />}

        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-8">
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-800">Nenhum resultado</h3>
            <p className="text-gray-500">Tente outros termos de busca.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;