import { array, date, option, ord, tuple } from 'fp-ts';
import type { Ord } from 'fp-ts/lib/Ord';
import { flow, pipe } from 'fp-ts/lib/function';

type Data = { value: number; date: Date };
type WeightedAverage = (data: Data[]) => number;

export const byDate: Ord<Data> = pipe(
  date.Ord,
  ord.contramap((data: Data) => data.date),
);

const weightFun = (x: number) => (Math.log(x * 2 + 0.3) / 3 + 5 / 7) ** (1 / 4);

const filterTop80 = (data: Data[]) => pipe(data, array.splitAt(Math.floor(data.length * 0.2)), tuple.snd);

const addWeight = (data: { value: number; index: number }[]) =>
  pipe(
    {
      first: pipe(
        data,
        array.map(({ index }) => index),
        array.head,
        option.getOrElse(() => 0),
      ),
      last: pipe(
        data,
        array.map(({ index }) => index),
        array.last,
        option.getOrElse(() => 1),
      ),
      data,
    },
    ({ data, first, last }) =>
      pipe(
        data,
        array.map(({ value, index }) => ({ value, percentage: (index - first) / last })),
      ),
    array.map(({ value, percentage }) => ({ value, weight: weightFun(percentage) })),
  );

const def: readonly [number, number] = [0, 0];

export const weightedAverage: WeightedAverage = flow(
  array.sort(byDate),
  filterTop80,
  array.map(({ date, value }) => ({ value, index: date.getTime() })),
  addWeight,
  array.reduce(def, ([acc, weightTotal], { value, weight }) => [acc + value * weight, weightTotal + weight] as const),
  ([sum, weights]) => sum / weights,
);
