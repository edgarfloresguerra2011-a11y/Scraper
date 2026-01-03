
import React, { useState, useEffect } from 'react';
import { huntWinningProducts } from '../services/geminiService';
import { WinningProduct, Language } from '../types';
import { translations } from '../translations';

interface DailyFinderProps {
  onAnalyzeProduct?: (product: WinningProduct) => void;
  lang: Language;
}

const DailyFinder: React.FC<DailyFinderProps> = ({ onAnalyzeProduct, lang }) => {
  const t = translations[lang];
  const [products, setProducts] = useState<WinningProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setScanStep(0);
    const logInterval = setInterval(() => setScanStep(p => (p < 5 ? p + 1 : p)), 1000);

    try {
      const results = await huntWinningProducts(lang);
      setProducts(results);
      localStorage.setItem(`daily_products_${lang}`, JSON.stringify({
        date: new Date().toDateString(),
        items: results
      }));
    } catch (error) {
      console.error("Scraping failed", error);
    } finally {
      clearInterval(logInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(`daily_products_${lang}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === new Date().toDateString()) {
        setProducts(parsed.items);
        return;
      }
    }
    fetchProducts();
  }, [lang]);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row items-stretch gap-6">
        <div className="flex-1 bg-surface border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t.realTime}</span>
            </div>
            <h2 className="text-4xl font-bold text-white font-display tracking-tight">{t.trends48h}</h2>
          </div>
        </div>

        <div className="xl:w-80 flex flex-col justify-center">
           <button 
             onClick={fetchProducts}
             disabled={loading}
             className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>manage_search</span>
             {loading ? t.loading : t.scanWeb}
           </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#0d131d] border border-border rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px]">
          <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8"></div>
          <p className="text-primary font-mono text-sm uppercase tracking-widest font-bold">{t.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
                <img src={product.imageUrl} className="size-full object-cover" onError={(e) => (e.target as any).src = `https://picsum.photos/seed/${product.name}/400/300`} />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">{product.niche}</p>
                <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 h-10">{product.name}</h3>
                <div className="p-3 bg-background rounded-xl border border-border/50 flex-1 mb-4 italic text-[11px] text-text-secondary leading-relaxed">
                  "{product.reasonWhyWinning}"
                </div>
                <button onClick={() => onAnalyzeProduct?.(product)} className="w-full py-2 bg-primary/10 border border-primary/30 hover:bg-primary text-white text-[10px] font-black uppercase rounded-lg transition-all">
                  {t.deepAnalysis}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyFinder;
