
import React, { useState, useLayoutEffect, useRef } from 'react';

interface TourStep {
  targetSelector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourGuideProps {
  steps: TourStep[];
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, stepIndex, onNext, onPrev, onClose }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState({ opacity: 0 });
  const currentStep = steps[stepIndex];

  useLayoutEffect(() => {
    const targetElement = document.querySelector(currentStep.targetSelector) as HTMLElement;

    // Clear previous highlights
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    if (targetElement) {
      targetElement.classList.add('tour-highlight');
      const rect = targetElement.getBoundingClientRect();

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

      const tooltipEl = tooltipRef.current;
      if (!tooltipEl) return;
      
      // We use a short timeout to ensure the tooltip element has been rendered and its dimensions are available
      const timer = setTimeout(() => {
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const offset = 15;
        const padding = 8;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let position = currentStep.position || 'bottom';

        const desiredPositions = {
          bottom: {
            top: rect.bottom + offset,
            left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
          },
          top: {
            top: rect.top - tooltipRect.height - offset,
            left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
          },
          left: {
            top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
            left: rect.left - tooltipRect.width - offset
          },
          right: {
            top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
            left: rect.right + offset
          }
        };

        const checkFits = (t: number, l: number) =>
          t >= padding && l >= padding &&
          (t + tooltipRect.height) <= (winHeight - padding) &&
          (l + tooltipRect.width) <= (winWidth - padding);

        const positionOrder: ('bottom' | 'top' | 'left' | 'right')[] = [...new Set([position, 'bottom', 'top', 'right', 'left'])];
        
        let finalTop: number, finalLeft: number;
        let foundFit = false;

        for (const pos of positionOrder) {
          const { top, left } = desiredPositions[pos];
          if (checkFits(top, left)) {
            finalTop = top;
            finalLeft = left;
            foundFit = true;
            break;
          }
        }
        
        // If no position fits perfectly, use the preferred one and clamp it to the viewport
        if (!foundFit) {
          const { top, left } = desiredPositions[position];
          finalTop = Math.max(padding, Math.min(top, winHeight - tooltipRect.height - padding));
          finalLeft = Math.max(padding, Math.min(left, winWidth - tooltipRect.width - padding));
        }

        setTooltipStyle({
          opacity: 1,
          top: `${finalTop!}px`,
          left: `${finalLeft!}px`,
          transform: 'none', // We calculate absolute positions, so transform is not needed.
        });

      }, 50); // Small delay for layout calculation

      return () => clearTimeout(timer);

    } else {
      // If target not found, center the tooltip
      setTooltipStyle({
        opacity: 1,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove('tour-highlight');
      }
    };
  }, [stepIndex, currentStep.targetSelector, currentStep.position]);


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300" onClick={onClose}>
      <style>{`
        .tour-highlight {
          position: relative !important;
          z-index: 60 !important;
          box-shadow: 0 0 0 4px #FBBF24, 0 0 15px rgba(251, 191, 36, 0.7) !important;
          border-radius: 0.75rem !important;
          transition: box-shadow 0.3s ease-in-out !important;
        }
      `}</style>
      
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-lg shadow-2xl p-4 w-64 max-w-xs z-70 animate-pop-in transition-all duration-300"
        style={tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg text-slate-800 mb-2">{currentStep.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{currentStep.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{stepIndex + 1} / {steps.length}</span>
          <div>
            {stepIndex > 0 && (
              <button onClick={onPrev} className="text-sm px-3 py-1 text-gray-600 rounded hover:bg-gray-100 transition-colors">Back</button>
            )}
            {stepIndex < steps.length - 1 ? (
              <button onClick={onNext} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2 transition-colors">Next</button>
            ) : (
              <button onClick={onClose} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2 transition-colors">Finish</button>
            )}
          </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center" aria-label="Close tour">
            <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default TourGuide;
