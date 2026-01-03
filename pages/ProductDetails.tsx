
import React, { useState, useEffect } from 'react';
import { WinningProduct } from '../types';
import { getDeepProductAnalysis } from '../services/geminiService';

interface ProductDetailsProps {
  product: WinningProduct | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const fetchDeepAnalysis = async () => {
        setLoading(true);
        try {
          const data = await getDeepProductAnalysis(product.name);
          setAnalysis(data);
        } catch (error) {
          console.error("Deep analysis failed", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDeepAnalysis();
    }
  }, [product]);

  if (!product) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-20 opacity-40">
        <span className="material-symbols-outlined text-[100px] mb-6">inventory_2</span>
        <h2 className="text-3xl font-bold font-display">No hay producto seleccionado</h2>
        <p className="max-w-md mt-4 text-text-secondary">Selecciona un producto en "Daily Hunt" para realizar un análisis profundo en tiempo real.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black">
            <span>Marketplace</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>{product.niche}</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-display tracking-tight mt-2 flex items-center gap-4">
            {product.name}
            {loading && <span className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-6 shadow-2xl">
            <img src={product.imageUrl} className="w-full aspect-square object-cover rounded-xl" alt={product.name} onError={(e) => (e.target as any).src = "https://picsum.photos/seed/placeholder/600"} />
            <div className="grid grid-cols-2 gap-4">
               <div><p className="text-[10px] text-text-secondary uppercase">Precio Est.</p><p className="text-2xl font-bold text-white">{product.priceEstimate}</p></div>
               <div className="text-right"><p className="text-[10px] text-emerald-500 uppercase">Margen</p><p className="text-2xl font-bold text-emerald-500">{product.potentialMargin}</p></div>
            </div>
          </div>
          
          <div className="bg-[#0d131d] rounded-2xl border border-border p-6">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">warning</span>
              Riesgos Críticos (IA)
            </h4>
            <ul className="space-y-3">
              {analysis?.topRisks?.map((risk: string, i: number) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-red-500 text-lg">•</span> {risk}
                </li>
              )) || <div className="animate-pulse space-y-2"><div className="h-3 bg-surface rounded"></div><div className="h-3 bg-surface rounded"></div></div>}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6">Competidores Reales Encontrados</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {analysis?.competitors?.map((comp: string, i: number) => (
                 <div key={i} className="p-4 bg-background border border-border rounded-xl flex items-center justify-between group hover:border-primary transition-all">
                    <span className="text-white font-medium">{comp}</span>
                    <span className="material-symbols-outlined text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                 </div>
               )) || <div className="col-span-full h-24 bg-background animate-pulse rounded-xl"></div>}
             </div>

             <div className="mt-8 p-6 bg-background rounded-2xl border border-border">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">forum</span>
                  Sentimiento del Consumidor
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  {analysis?.customerSentiment || "Analizando reseñas en Amazon, Reddit y TikTok..."}
                </p>
             </div>

             <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-xs font-bold text-text-secondary uppercase mb-4 tracking-widest">Fuentes de Verificación Live</h4>
                <div className="flex flex-wrap gap-2">
                   {analysis?.sources?.map((s: any, i: number) => (
                     <a key={i} href={s.uri} target="_blank" className="px-3 py-1.5 bg-surface-light border border-border rounded-lg text-[10px] text-white hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">public</span> {s.title}
                     </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
