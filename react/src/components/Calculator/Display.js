import React from 'react';

const Display = ({ value, subValue }) => {
  return (
    <div data-easytag="id1-src/components/Calculator/Display.js" className="w-full rounded-2xl bg-calc.panel calc-glow p-4 sm:p-6 mb-3 sm:mb-4">
      {subValue ? (
        <div data-easytag="id2-src/components/Calculator/Display.js" className="text-right text-sm text-calc-subtext mb-1" aria-live="polite">{subValue}</div>
      ) : (
        <div data-easytag="id3-src/components/Calculator/Display.js" className="h-4" aria-hidden="true"></div>
      )}
      <div
        data-easytag="id4-src/components/Calculator/Display.js"
        className="calc-display text-right font-semibold text-white truncate"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </div>
    </div>
  );
};

export default Display;
