
import React, { useState, useEffect, useMemo } from 'react';
import { fetchSheetData } from './services/sheetService';
import { SheetItem } from './types';
import Card from './components/Card';
import AIAssistant from './components/AIAssistant';

type TabType = {
  id: string;
  label: string;
  gid: string;
  icon: React.ReactNode;
};

const TABS: TabType[] = [
  { 
    id: 'empresas', 
    label: 'Empresas', 
    gid: '2050396937',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    id: 'supermercados', 
    label: 'Supermercados', 
    gid: '1809531399',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

const App: React.FC = () => {
  const [items, setItems] = useState<SheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSheetData(activeTab.gid);
        setItems(data);
        setError(null);
      } catch (err) {
        setError(`Falha ao carregar dados da aba ${activeTab.label}. Verifique a conexão.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

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
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Belo Jardim • PE</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 md:hidden hover:bg-gray-200 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar..."
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
                <option value="rating">Destaques</option>
                <option value="name">A - Z</option>
              </select>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden md:flex p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-indigo-600 transition-all duration-200"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Abas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-sm
                  ${activeTab.id === tab.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-8">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {items.length > 0 && <AIAssistant data={items} />}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-400 animate-pulse">Carregando {activeTab.label}...</p>
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-8 animate-fade-in">
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-800">Nenhum resultado em {activeTab.label}</h3>
            <p className="text-gray-500">Tente buscar por outro termo.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
