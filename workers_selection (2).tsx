import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';

export default function App() {
  // État pour suivre l'option sélectionnée ('work' ou 'hire')
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-hidden flex flex-col">
      {/* Styles d'animation personnalisés pour le côté "soft futuriste" */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse-slow {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; transform: scale(0.98); }
            50% { opacity: 0.6; transform: scale(1.02); }
          }
          .ring-forward {
            animation: spin-slow 24s linear infinite;
          }
          .ring-reverse {
            animation: spin-reverse-slow 18s linear infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* Formes d'arrière-plan douces (reproduction des cercles roses en bas à droite) */}
      <div className="absolute -bottom-80 -right-40 w-[1000px] h-[1000px] bg-[#fceeee]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-20 w-[600px] h-[600px] bg-[#fadcdb]/40 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête : Type de compte et Barre de progression */}
      <header className="max-w-5xl mx-auto w-full pt-10 px-8 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-[15px] font-bold text-slate-900 tracking-wide">Type de compte</h2>
          <span className="text-[15px] font-medium text-slate-400">1 / 4</span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-[#D96B62] rounded-full transition-all duration-500 ease-out"></div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-8 relative z-10 -mt-10">
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-20 text-center tracking-tight">
          Qu'est-ce qui vous amène chez Workers ?
        </h1>

        {/* Conteneur des cercles d'options */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center justify-center">
          
          {/* Option 1 : Cherche du travail */}
          <SelectionCircle 
            selected={selectedType === 'work'}
            onClick={() => setSelectedType('work')}
            icon={User}
            title="Je cherche du travail"
            description="Indépendant • Flexible • Employé"
          />

          {/* Option 2 : Recrute */}
          <SelectionCircle 
            selected={selectedType === 'hire'}
            onClick={() => setSelectedType('hire')}
            icon={Building2}
            title="Je recrute"
            description="Je représente une entreprise"
          />

        </div>
      </main>
    </div>
  );
}

/**
 * Composant Cercle avec l'animation soft-futuriste
 */
function SelectionCircle({ selected, onClick, icon: Icon, title, description }) {
  // On utilise un état local pour gérer le hover et appliquer les mêmes effets que la sélection
  const [isHovered, setIsHovered] = useState(false);
  const isActive = selected || isHovered;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[320px] h-[320px] rounded-full cursor-pointer transition-all duration-300 ease-out flex items-center justify-center
        ${isActive ? 'animate-float scale-105 opacity-100' : 'scale-100 opacity-80'}
      `}
    >
      {/* Halo lumineux en arrière-plan */}
      <div className={`absolute inset-[-10px] rounded-full blur-2xl transition-all duration-500
        ${isActive ? 'bg-[#D96B62]/20 animate-pulse-glow opacity-100' : 'bg-slate-200/50 opacity-0'}
      `} />

      {/* Anneau extérieur en pointillés (HUD effect) */}
      <div className={`absolute inset-0 rounded-full ring-forward transition-all duration-300
        border-[2px] border-dashed
        ${isActive ? 'border-[#D96B62]/50' : 'border-slate-300'}
      `} />

      {/* Anneau intérieur avec arcs coupés (Rotation inversée) */}
      <div className={`absolute inset-[15px] rounded-full ring-reverse transition-all duration-300
        border-[3px] border-t-transparent border-b-transparent
        ${isActive ? 'border-l-[#D96B62]/40 border-r-[#D96B62]/40' : 'border-l-slate-200 border-r-slate-200'}
      `} />

      {/* Cercle central (La carte elle-même) */}
      <div className={`relative w-[260px] h-[260px] rounded-full bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-300
        ${isActive ? 'shadow-[#D96B62]/20 border-2 border-[#D96B62]/80' : 'shadow-slate-200/50 border border-slate-100'}
      `}>
        
        {/* Icône avec effet d'ombre douce */}
        <div className={`mb-5 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
          <Icon 
            size={52} 
            strokeWidth={1.5} 
            className={`transition-colors duration-300 ${isActive ? 'text-[#D96B62] drop-shadow-md' : 'text-slate-400'}`} 
          />
        </div>
        
        <h3 className="text-[22px] font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </h3>
        
        <p className={`text-[14px] font-medium transition-colors duration-300 ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
          {description}
        </p>

      </div>
    </div>
  );
}