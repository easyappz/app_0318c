import React from 'react';
import Button from './Button';

const Keypad = ({ onDigit, onDot, onOperator, onEquals, onToggleSign, onPercent, onClear, clearLabel, activeOperator }) => {
  return (
    <div data-easytag="id1-src/components/Calculator/Keypad.js" className="grid grid-cols-4 gap-2 sm:gap-3">
      <Button label={clearLabel} ariaLabel={clearLabel} onClick={onClear} variant="alt" />
      <Button label="+/−" ariaLabel="Поменять знак" onClick={onToggleSign} variant="alt" />
      <Button label="%" ariaLabel="Процент" onClick={onPercent} variant="alt" />
      <Button label="÷" ariaLabel="Деление" onClick={() => onOperator('÷')} variant="operator" isActive={activeOperator === '÷'} />

      <Button label="7" ariaLabel="7" onClick={() => onDigit('7')} />
      <Button label="8" ariaLabel="8" onClick={() => onDigit('8')} />
      <Button label="9" ariaLabel="9" onClick={() => onDigit('9')} />
      <Button label="×" ariaLabel="Умножение" onClick={() => onOperator('×')} variant="operator" isActive={activeOperator === '×'} />

      <Button label="4" ariaLabel="4" onClick={() => onDigit('4')} />
      <Button label="5" ariaLabel="5" onClick={() => onDigit('5')} />
      <Button label="6" ariaLabel="6" onClick={() => onDigit('6')} />
      <Button label="−" ariaLabel="Вычитание" onClick={() => onOperator('−')} variant="operator" isActive={activeOperator === '−'} />

      <Button label="1" ariaLabel="1" onClick={() => onDigit('1')} />
      <Button label="2" ariaLabel="2" onClick={() => onDigit('2')} />
      <Button label="3" ariaLabel="3" onClick={() => onDigit('3')} />
      <Button label="+" ariaLabel="Сложение" onClick={() => onOperator('+')} variant="operator" isActive={activeOperator === '+'} />

      <Button label="0" ariaLabel="0" onClick={() => onDigit('0')} isWide />
      <Button label="," ariaLabel="Десятичная точка" onClick={onDot} />
      <Button label="=" ariaLabel="Равно" onClick={onEquals} variant="operator" />
    </div>
  );
};

export default Keypad;
