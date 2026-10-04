import React from 'react';

export type LogoVariant = 'full' | 'compact' | 'icon' | 'loading' | 'favicon';

interface MedSynapseLogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  showSubtitle?: boolean;
  animated?: boolean;
  borderless?: boolean;
}

export const MedSynapseLogo: React.FC<MedSynapseLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  showSubtitle = false,
  animated = false,
  borderless = false,
}) => {
  const boxSizes: Record<string, string> = {
    xs: 'w-6 h-6 rounded-md p-0.5',
    sm: 'w-8 h-8 rounded-lg p-0.5',
    md: 'w-10 h-10 rounded-xl p-1',
    lg: 'w-12 h-12 rounded-2xl p-1.5',
    xl: 'w-16 h-16 rounded-2xl p-2',
    '2xl': 'w-24 h-24 rounded-3xl p-3',
    hero: 'w-28 h-28 md:w-32 md:h-32 rounded-3xl p-3.5',
  };

  const textSizes: Record<string, { title: string; subtitle: string }> = {
    xs: { title: 'text-xs', subtitle: 'text-[8px]' },
    sm: { title: 'text-sm', subtitle: 'text-[9px]' },
    md: { title: 'text-base md:text-lg', subtitle: 'text-[10px]' },
    lg: { title: 'text-xl md:text-2xl', subtitle: 'text-xs' },
    xl: { title: 'text-2xl md:text-3xl', subtitle: 'text-sm' },
    '2xl': { title: 'text-3xl md:text-4xl', subtitle: 'text-base' },
    hero: { title: 'text-3xl sm:text-4xl', subtitle: 'text-sm' },
  };

  const currentBox = boxSizes[size] || boxSizes.md;
  const currentText = textSizes[size] || textSizes.md;

  const renderIconBox = () => (
    <div
      className={`relative flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 ${
        borderless
          ? 'bg-transparent'
          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs'
      } ${currentBox} ${animated ? 'hover:scale-105' : ''}`}
    >
      <img
        src="/brand/medsynapse-icon.png"
        alt="MedSynapse AI Logo"
        className="w-full h-full max-w-full max-h-full object-contain select-none"
      />
    </div>
  );

  // Loading variant with signature MedSynapse animation
  if (variant === 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 shadow-md relative z-10 animate-pulse">
            <img
              src="/brand/medsynapse-icon.png"
              alt="MedSynapse AI"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-lg font-black tracking-tight text-slate-900 dark:text-white">
          <span>MedSynapse</span>
          <span className="text-cyan-500">AI</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium animate-pulse">
          Reconstructing patient journey...
        </p>
      </div>
    );
  }

  // Icon only
  if (variant === 'icon' || variant === 'favicon') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        {renderIconBox()}
      </div>
    );
  }

  // Compact variant (icon box + clean typography)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2.5 select-none ${className}`}>
        {renderIconBox()}
        <div className="flex flex-col leading-none">
          <div className="flex items-center space-x-1">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white ${currentText.title}`}>
              MedSynapse
            </span>
            <span className={`font-black tracking-tight text-cyan-500 ${currentText.title}`}>
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className={`uppercase font-bold tracking-wider text-slate-400 mt-0.5 ${currentText.subtitle}`}>
              Clinical Intelligence
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full canonical brand mark
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center space-x-3">
        {renderIconBox()}
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-tight">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white ${currentText.title}`}>
              MedSynapse
            </span>
            <span className={`font-black tracking-tight text-cyan-500 ${currentText.title}`}>
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className={`font-semibold tracking-normal text-slate-500 dark:text-slate-400 mt-0.5 ${currentText.subtitle}`}>
              Clinical Journey &amp; Evidence Intelligence
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedSynapseLogo;
