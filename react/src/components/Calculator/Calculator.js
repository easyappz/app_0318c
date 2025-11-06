import React, { useEffect, useReducer, useCallback } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { initialState, reducer, getDisplay, getSubDisplay, getClearLabel } from './logic';

const Calculator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDigit = useCallback((d) => dispatch({ type: 'INPUT_DIGIT', digit: d }), []);
  const handleDot = useCallback(() => dispatch({ type: 'INPUT_DOT' }), []);
  const handleOperator = useCallback((op) => dispatch({ type: 'SET_OPERATOR', operator: op }), []);
  const handleEquals = useCallback(() => dispatch({ type: 'EQUALS' }), []);
  const handleToggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), []);
  const handlePercent = useCallback(() => dispatch({ type: 'PERCENT' }), []);
  const handleClear = useCallback(() => {
    const label = getClearLabel(state);
    dispatch({ type: label === 'AC' ? 'ALL_CLEAR' : 'CLEAR_ENTRY' });
  }, [state]);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        dispatch({ type: 'INPUT_DIGIT', digit: key });
        return;
      }
      if (key === '.' || key === ',') {
        e.preventDefault();
        dispatch({ type: 'INPUT_DOT' });
        return;
      }
      if (key === '+' || key === '-') {
        e.preventDefault();
        dispatch({ type: 'SET_OPERATOR', operator: key === '+' ? '+' : '−' });
        return;
      }
      if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        dispatch({ type: 'SET_OPERATOR', operator: '×' });
        return;
      }
      if (key === '/') {
        e.preventDefault();
        dispatch({ type: 'SET_OPERATOR', operator: '÷' });
        return;
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        dispatch({ type: 'EQUALS' });
        return;
      }
      if (key === 'Escape') {
        e.preventDefault();
        dispatch({ type: 'ALL_CLEAR' });
        return;
      }
      if (key === '%') {
        e.preventDefault();
        dispatch({ type: 'PERCENT' });
        return;
      }
      if (key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'BACKSPACE' });
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const displayValue = getDisplay(state);
  const subValue = getSubDisplay(state);
  const clearLabel = getClearLabel(state);

  return (
    <div data-easytag="id1-src/components/Calculator/Calculator.js" className="w-full bg-calc.bg p-4 rounded-3xl shadow-soft">
      <div data-easytag="id2-src/components/Calculator/Calculator.js" className="bg-calc.panel rounded-3xl calc-glow p-4 sm:p-6">
        <Display value={displayValue} subValue={subValue} />
        <Keypad
          onDigit={handleDigit}
          onDot={handleDot}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onToggleSign={handleToggleSign}
          onPercent={handlePercent}
          onClear={handleClear}
          clearLabel={clearLabel}
          activeOperator={state.operator}
        />
      </div>
    </div>
  );
};

export default Calculator;
