import { filterTop80, roundTo3Digits, weightFun, weightedAverage } from '$lib/math';
import { assert, describe, it } from 'vitest';

const arrayEquals = (a: { value: number; date: Date }[], b: { value: number; date: Date }[]) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const aItem = a[i];
    const bItem = b[i];
    if (aItem.value !== bItem.value || aItem.date.getTime() !== bItem.date.getTime()) {
      return false;
    }
  }
  return true;
};

describe('weight', () => {
  it('weighting function should be ascending', () => {
    let last = 0;
    for (let i = 0; i < 1; i += 0.01) {
      const calc = weightFun(i);
      assert(calc > last);
      last = calc;
    }
  });
});

describe('utils', () => {
  it('rounding to 3 digits', () => {
    assert(roundTo3Digits(1) === 1);
    assert(roundTo3Digits(1.1) === 1.1);
    assert(roundTo3Digits(1.11) === 1.11);
    assert(roundTo3Digits(1.111) === 1.111);
    assert(roundTo3Digits(1.1111) === 1.111);
    assert(roundTo3Digits(1.11111) === 1.111);
    assert(roundTo3Digits(1.111111) === 1.111);
    assert(roundTo3Digits(1.1111111) === 1.111);
    assert(roundTo3Digits(1.11111111) === 1.111);
  });
  it('filtering top 80%', () => {
    assert(filterTop80([]).length === 0);
    assert(filterTop80([{ value: 1, date: new Date(2021, 0, 1) }]).length === 1);
    assert(
      filterTop80([
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
      ]).length === 2,
    );
    assert(
      filterTop80([
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
      ]).length === 3,
    );
    assert(
      filterTop80([
        { value: 100, date: new Date(2020, 0, 1) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
      ]).length === 8,
    );
    assert(
      arrayEquals(
        filterTop80([
          { value: 100, date: new Date(2020, 0, 1) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
        ]),
        [
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
        ],
      ),
    );
    assert(
      filterTop80([
        { value: 100, date: new Date(2020, 0, 1) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 100, date: new Date(2020, 0, 1) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
        { value: 1, date: new Date(2021, 0, 1) },
        { value: 5, date: new Date(2021, 0, 2) },
        { value: 6, date: new Date(2021, 0, 2) },
      ]).length === 16,
    );
  });
});

describe('average', () => {
  it('calculating average', () => {
    assert(weightedAverage([{ value: 1, date: new Date(2021, 0, 1) }]) === 1);
    assert(
      roundTo3Digits(
        weightedAverage([
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
        ]),
      ) === 3,
    );
    assert(
      roundTo3Digits(
        weightedAverage([
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
        ]),
      ) === 4,
    );
    assert(
      roundTo3Digits(
        weightedAverage([
          { value: 100, date: new Date(2020, 0, 1) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
          { value: 1, date: new Date(2021, 0, 1) },
          { value: 5, date: new Date(2021, 0, 2) },
          { value: 6, date: new Date(2021, 0, 2) },
        ]),
      ) === 4.375,
    );
  });
});
