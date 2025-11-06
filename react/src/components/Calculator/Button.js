import React from 'react';

const Button = ({ label, ariaLabel, onClick, variant = 'default', isWide = false, isActive = false, testId }) => {
  const base = 'calc-pressable select-none rounded-xl text-lg sm:text-xl font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-calc.accent focus-visible:ring-offset-2 focus-visible:ring-offset-calc.panel';

  const palette = {
    default: 'calc-key-base text-calc-text hover:bg-[#2a2e37]',
    alt: 'bg-calc-key-alt text-calc-text hover:bg-[#343947]',
    operator: `${isActive ? 'calc-operator-active' : 'calc-operator-base'} hover:brightness-105`,
  };

  const classes = `${base} ${palette[variant] || palette.default} ${isWide ? 'col-span-2' : ''} py-4`;

  return (
    <button
      data-easytag={`id1-src/components/Calculator/Button.js-${label}`}
      type="button"
      aria-label={ariaLabel || label}
      className={classes}
      onClick={onClick}
      data-testid={testId}
    >
      <span data-easytag={`id2-src/components/Calculator/Button.js-${label}`} className="block leading-none">{label}</span>
    </button>
  );
};

export default Button;
