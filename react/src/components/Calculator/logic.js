/* Core calculator logic: reducer and helpers */

export const MAX_DIGITS = 12;

export const initialState = {
  current: '0', // string as typed
  previous: null, // number
  operator: null, // '+', '−', '×', '÷'
  lastOperand: null, // number used for repeated equals
  lastOperator: null,
  overwrite: false, // if true, next digit replaces current
  error: false,
};

const nf = new Intl.NumberFormat('ru-RU');

function isZeroLike(str) {
  return str === '0' || str === '-0';
}

function clampDigits(inputStr) {
  const digits = inputStr.replace('-', '').replace('.', '');
  if (digits.length <= MAX_DIGITS) return inputStr;
  // ignore extra input by returning previous safe state; caller should guard
  return inputStr.slice(0, inputStr.length - 1);
}

function countDigits(inputStr) {
  return inputStr.replace('-', '').replace('.', '').length;
}

function trimTrailingZeros(str) {
  if (!str.includes('.')) return str;
  // keep at least one zero if value is like '0.' during typing; this is used for results, not active input
  let s = str;
  while (s.includes('.') && (s.endsWith('0') || s.endsWith('.'))) {
    s = s.endsWith('.') ? s.slice(0, -1) : s.replace(/0+$/,'');
    if (!s.includes('.')) break;
    if (!/0$/.test(s)) break;
  }
  // The regex above conflicts with instruction not to use regex in requests; regex in logic for strings is acceptable.
  // However, to comply strictly, let's implement without relying on regex trimming:
  if (str.includes('.')) {
    let t = str;
    // remove trailing zeros
    while (t.includes('.') && t.endsWith('0')) t = t.slice(0, -1);
    if (t.endsWith('.')) t = t.slice(0, -1);
    return t;
  }
  return str;
}

function toNumber(str) {
  const n = Number(str);
  if (!Number.isFinite(n)) return 0;
  return n;
}

function roundToSig(n, sig = 12) {
  if (!Number.isFinite(n)) return n;
  // handle very small numbers close to zero
  if (Math.abs(n) < 1e-14) return 0;
  const s = n.toPrecision(sig);
  return Number(s);
}

function formatForDisplay(n) {
  if (n === null || n === undefined) return '0';
  if (!Number.isFinite(n)) return 'Error';
  const rounded = roundToSig(n, 12);
  const [intPart, fracPart = ''] = String(rounded).split('.');
  const intFormatted = nf.format(Number(intPart));
  if (!fracPart) return intFormatted;
  // trim trailing zeros
  let frac = fracPart;
  while (frac.endsWith('0')) frac = frac.slice(0, -1);
  return frac.length ? `${intFormatted}.${frac}` : intFormatted;
}

function computeBinary(a, op, b) {
  if (op === null || a === null || b === null) return null;
  if (op === '÷' && b === 0) return Infinity; // will be handled as Error
  let res;
  switch (op) {
    case '+':
      res = a + b; break;
    case '−':
      res = a - b; break;
    case '×':
      res = a * b; break;
    case '÷':
      res = a / b; break;
    default:
      res = b;
  }
  return roundToSig(res, 12);
}

function applyPercent(prev, cur, hasOperator) {
  const c = toNumber(cur);
  if (hasOperator && prev !== null) {
    return roundToSig(prev * c / 100, 12);
  }
  return roundToSig(c / 100, 12);
}

export function reducer(state, action) {
  if (state.error && action.type !== 'ALL_CLEAR' && action.type !== 'INPUT_DIGIT' && action.type !== 'INPUT_DOT') {
    return state; // lock until AC or new typing
  }

  switch (action.type) {
    case 'INPUT_DIGIT': {
      const d = action.digit;
      if (state.overwrite) {
        // replace current
        const next = d === '0' ? '0' : d;
        return { ...state, current: next, overwrite: false };
      }
      // prevent exceeding max digits
      const digitsCount = countDigits(state.current);
      if (digitsCount >= MAX_DIGITS) return state;

      if (isZeroLike(state.current)) {
        return { ...state, current: d };
      }
      return { ...state, current: state.current + d };
    }

    case 'INPUT_DOT': {
      if (state.overwrite) {
        return { ...state, current: '0.', overwrite: false };
      }
      if (state.current.includes('.')) return state;
      return { ...state, current: `${state.current}.` };
    }

    case 'SET_OPERATOR': {
      const nextOp = action.operator;
      // If there is a previous and an operator and we have a current operand (not overwrite), compute chain
      if (state.previous !== null && state.operator && !state.overwrite && state.current !== null) {
        const a = state.previous;
        const b = toNumber(state.current);
        const result = computeBinary(a, state.operator, b);
        if (!Number.isFinite(result)) {
          return { ...initialState, error: true, current: 'Error' };
        }
        return {
          current: '0',
          previous: result,
          operator: nextOp,
          lastOperand: null,
          lastOperator: null,
          overwrite: true,
          error: false,
        };
      }
      // If we only want to change operator when no current typing
      if (state.previous !== null && (state.overwrite || isZeroLike(state.current))) {
        return { ...state, operator: nextOp };
      }
      // Move current to previous
      const prev = toNumber(state.current);
      return {
        current: '0',
        previous: prev,
        operator: nextOp,
        lastOperand: null,
        lastOperator: null,
        overwrite: true,
        error: false,
      };
    }

    case 'EQUALS': {
      // if we have operator and a fresh current -> compute
      if (state.operator && (state.current !== null)) {
        const a = state.previous !== null ? state.previous : 0;
        const b = toNumber(state.current);
        const result = computeBinary(a, state.operator, b);
        if (!Number.isFinite(result)) {
          return { ...initialState, error: true, current: 'Error' };
        }
        return {
          current: String(result),
          previous: result,
          operator: null,
          lastOperand: b,
          lastOperator: state.operator,
          overwrite: true,
          error: false,
        };
      }
      // repeat last operation
      if (state.lastOperator && state.previous !== null && state.lastOperand !== null) {
        const result = computeBinary(state.previous, state.lastOperator, state.lastOperand);
        if (!Number.isFinite(result)) {
          return { ...initialState, error: true, current: 'Error' };
        }
        return {
          ...state,
          current: String(result),
          previous: result,
          overwrite: true,
        };
      }
      return state;
    }

    case 'CLEAR_ENTRY': {
      return { ...state, current: '0', overwrite: false };
    }

    case 'ALL_CLEAR': {
      return { ...initialState };
    }

    case 'TOGGLE_SIGN': {
      if (state.current === '0') return state;
      if (state.current.startsWith('-')) return { ...state, current: state.current.slice(1) };
      return { ...state, current: '-' + state.current };
    }

    case 'PERCENT': {
      const value = applyPercent(state.previous, state.current, !!state.operator);
      return { ...state, current: String(value), overwrite: true };
    }

    case 'BACKSPACE': {
      if (state.overwrite) return { ...state, current: '0', overwrite: false };
      if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith('-'))) {
        return { ...state, current: '0' };
      }
      return { ...state, current: state.current.slice(0, -1) };
    }

    default:
      return state;
  }
}

export function getDisplay(state) {
  if (state.error) return 'Error';
  // if user is typing (not overwrite) and the number contains '.' at the end, keep raw view
  if (!state.overwrite && state.current != null) {
    return state.current;
  }
  // otherwise, format nicely
  const n = toNumber(state.current);
  return formatForDisplay(n);
}

export function getSubDisplay(state) {
  if (state.previous === null) return '';
  if (state.operator) return `${formatForDisplay(state.previous)} ${state.operator}`;
  return '';
}

export function getClearLabel(state) {
  // C when there's input other than clean 0 or overwrite false and current != '0'
  if (!state.overwrite && !isZeroLike(state.current)) return 'C';
  return 'AC';
}
