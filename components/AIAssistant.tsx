
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SheetItem } from '../types';

interface AIAssistantProps {
  data: SheetItem[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsight = async () => {
    if (!process.env.API_KEY) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const itemsSummary = data.slice(0, 15).map(i => `${i.name} (Nota: ${i.rating})`).join(', ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise estes itens e forneça 3 pontos rápidos em português sobre as melhores opções: ${itemsSummary}`,
        config: {
            systemInstruction: "Você é um assistente analista de dados conciso."
        }
      });

      setInsight(response.text || "Não foi possível gerar insights.");
    } catch (err) {
      console.error(err);
      setInsight("Erro ao contatar a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-indigo-900">IA Gemini Insights</h2>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading || data.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
        >
          {loading ? 'Analisando...' : 'Gerar Insights'}
        </button>
      </div>
      
      {insight && (
        <div className="bg-white bg-opacity-60 p-4 rounded-xl border border-indigo-200 animate-fade-in">
          <p className="text-indigo-800 leading-relaxed whitespace-pre-wrap">{insight}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
