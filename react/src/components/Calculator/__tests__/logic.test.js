import { reducer, initialState } from '../../Calculator/logic';

function run(actions) {
  return actions.reduce((s, a) => reducer(s, a), { ...initialState });
}

test('0.1 + 0.2 ≈ 0.3', () => {
  const end = run([
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'INPUT_DOT' },
    { type: 'INPUT_DIGIT', digit: '1' },
    { type: 'SET_OPERATOR', operator: '+' },
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'INPUT_DOT' },
    { type: 'INPUT_DIGIT', digit: '2' },
    { type: 'EQUALS' }
  ]);
  expect(Number(end.current)).toBeCloseTo(0.3, 12);
});

test('Percent with operator uses prev * cur / 100', () => {
  const end = run([
    { type: 'INPUT_DIGIT', digit: '2' },
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'SET_OPERATOR', operator: '+' },
    { type: 'INPUT_DIGIT', digit: '1' },
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'PERCENT' }, // 10% of 20 => 2
    { type: 'EQUALS' }
  ]);
  expect(Number(end.current)).toBe(22);
});

test('Repeat equals uses last operator and operand', () => {
  const end = run([
    { type: 'INPUT_DIGIT', digit: '1' },
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'SET_OPERATOR', operator: '+' },
    { type: 'INPUT_DIGIT', digit: '5' },
    { type: 'EQUALS' }, // 15
    { type: 'EQUALS' }, // 20
    { type: 'EQUALS' }, // 25
  ]);
  expect(Number(end.current)).toBe(25);
});

test('Division by zero -> Error state', () => {
  const end = run([
    { type: 'INPUT_DIGIT', digit: '5' },
    { type: 'SET_OPERATOR', operator: '÷' },
    { type: 'INPUT_DIGIT', digit: '0' },
    { type: 'EQUALS' },
  ]);
  expect(end.error).toBe(true);
  expect(end.current).toBe('Error');
});

test('Max digits limit', () => {
  const actions = Array.from({ length: 15 }, () => ({ type: 'INPUT_DIGIT', digit: '9' }));
  const end = run(actions);
  expect(end.current.length).toBeLessThanOrEqual(12);
});
