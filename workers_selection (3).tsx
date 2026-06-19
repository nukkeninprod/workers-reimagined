import React, { useState } from 'react';
import { Monitor, Sparkles, FileText, PenLine, ChevronRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-hidden flex flex-col">
      {/* Styles d'animation personnalisés */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; transform: scale(0.98); }
            50% { opacity: 0.7; transform: scale(1.02); }
          }
          @keyframes sparkle-twinkle {
            0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.5; transform: scale(0.8) rotate(15deg); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 4s ease-in-out infinite;
          }
          .animate-sparkle {
            animation: sparkle-twinkle 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Formes d'arrière-plan douces */}
      <div className="absolute -bottom-80 -right-40 w-[1000px] h-[1000px] bg-[#fceeee]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-20 w-[600px] h-[600px] bg-[#fadcdb]/40 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête : Type de compte et Barre de progression */}
      <header className="max-w-5xl mx-auto w-full pt-10 px-8 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-[15px] font-bold text-slate-900 tracking-wide">Offre d'emploi</h2>
          <span className="text-[15px] font-medium text-slate-400">2 / 4</span>
        </div>
        
        {/* Barre de progression (Mise à jour à 2/4) */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-2/4 bg-[#D96B62] rounded-full transition-all duration-700 ease-out"></div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-8 relative z-10 -mt-8">
        
        {/* Badge de contexte */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm mb-16 self-start md:ml-12 lg:ml-24">
          <Monitor size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Entreprise / Digital</span>
        </div>

        {/* Conteneur des cartes d'options */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center justify-center">
          
          {/* Option 1 : Import IA */}
          <ActionCard 
            isAI={true}
            icon={Sparkles}
            title={
              <>
                Aller <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">3× plus vite</span> avec l'IA
              </>
            }
            description="en important votre offre d'emploi"
            buttonText="Importer mon offre"
            buttonIcon={FileText}
          />

          {/* Option 2 : Création manuelle */}
          <ActionCard 
            isAI={false}
            icon={PenLine}
            title="Vous n'avez pas d'offre d'emploi ?"
            description="Créez-la maintenant"
            buttonText="Compléter mon offre"
            buttonIcon={ChevronRight}
          />

        </div>
      </main>
    </div>
  );
}

/**
 * Composant Carte d'Action (remplace ActionCircle)
 */
function ActionCard({ isAI, icon: Icon, title, description, buttonText, buttonIcon: ButtonIcon }) {
  const [isHovered, setIsHovered] = useState(false);

  // Thèmes de couleurs selon si c'est l'option IA ou Standard
  const theme = isAI ? {
    glow: 'bg-fuchsia-500/20',
    dashedActive: 'border-fuchsia-400/60',
    cardBorderActive: 'border-fuchsia-400/80 shadow-fuchsia-500/20',
    iconColorActive: 'text-fuchsia-500',
    btnBgActive: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md shadow-pink-500/25',
    btnBgIdle: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
  } : {
    glow: 'bg-[#D96B62]/20',
    dashedActive: 'border-[#D96B62]/50',
    cardBorderActive: 'border-[#D96B62]/80 shadow-[#D96B62]/20',
    iconColorActive: 'text-[#D96B62]',
    btnBgActive: 'bg-[#D96B62] text-white border-[#D96B62] shadow-md shadow-[#D96B62]/25',
    btnBgIdle: 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[400px] h-[260px] cursor-pointer transition-all duration-300 ease-out flex items-center justify-center
        ${isHovered ? 'animate-float scale-105 opacity-100' : 'scale-100 opacity-90'}
      `}
    >
      {/* Étoile scintillante pour l'IA (en haut à droite) */}
      {isAI && isHovered && (
        <div className="absolute -top-3 -right-3 z-20 animate-sparkle text-pink-400">
          <Sparkles size={36} fill="currentColor" />
        </div>
      )}

      {/* Halo lumineux en arrière-plan */}
      <div className={`absolute inset-[-15px] rounded-[2.5rem] blur-2xl transition-all duration-500
        ${isHovered ? `${theme.glow} animate-pulse-glow opacity-100` : 'bg-slate-200/40 opacity-0'}
      `} />

      {/* Cadre extérieur en pointillés (HUD effect rectangulaire) */}
      <div className={`absolute inset-0 rounded-[2rem] transition-all duration-300
        border-[2px] border-dashed
        ${isHovered ? theme.dashedActive : 'border-slate-300'}
      `} />

      {/* Carte centrale (Le bloc principal) */}
      <div className={`absolute inset-[12px] rounded-3xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-300
        ${isHovered ? `border-2 ${theme.cardBorderActive}` : 'border border-slate-100 shadow-slate-200/50'}
      `}>
        
        {/* Icône principale */}
        <div className={`mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <Icon 
            size={38} 
            strokeWidth={1.5} 
            className={`transition-colors duration-300 ${isHovered ? `${theme.iconColorActive} drop-shadow-md` : 'text-slate-400'}`} 
          />
        </div>
        
        {/* Textes */}
        <h3 className="text-[20px] font-bold text-slate-900 mb-2 leading-snug px-2">
          {title}
        </h3>
        
        <p className={`text-[14px] font-medium mb-8 transition-colors duration-300 ${isHovered ? 'text-slate-600' : 'text-slate-500'}`}>
          {description}
        </p>

        {/* Bouton d'action intégré */}
        <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 border
          ${isHovered ? theme.btnBgActive : theme.btnBgIdle}
        `}>
          {isAI && <ButtonIcon size={16} />}
          {buttonText}
          {!isAI && <ButtonIcon size={16} />}
        </div>

      </div>
    </div>
  );
}